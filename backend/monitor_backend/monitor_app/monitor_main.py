from anyio.lowlevel import RunVar
from anyio import CapacityLimiter
import uvicorn
import re
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from api.routers import router


class WAFMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.sql_injection_pattern = re.compile(r"(?:')|(?:--)|(/\*)|(\*/)|(;)|(@@)|(union)|(select)|(insert)|(delete)|(update)|(drop)", re.IGNORECASE)
        self.xss_pattern = re.compile(r"(<script.*?>|javascript:|<img.*?onerror=)", re.IGNORECASE)
        self.blocked_ips = {"192.168.1.100", "2.57.122.234", "64.62.156.197"}  # Здесь может быть список заблокированных IP, например все заграничные

    async def dispatch(self, request: Request, call_next):
        # Блокировка IP
        client_ip = request.client.host
        if client_ip in self.blocked_ips:
            raise HTTPException(status_code=403, detail="Access forbidden")

        # Блокировка SQL-инъекций и XSS
        query_params = request.query_params
        for key, value in query_params.items():
            if self.sql_injection_pattern.search(value) or self.xss_pattern.search(value):
                raise HTTPException(status_code=400, detail="Potential attack detected")

        return await call_next(request)


app = FastAPI(title='Fetal monitor App')


@app.on_event("startup")
def startup():
    # print("start")
    RunVar("_default_thread_limiter").set(CapacityLimiter(2))


app.add_middleware(WAFMiddleware)

origins = [

        "http://localhost:5173"
           ]

app.add_middleware(CORSMiddleware,
                        # allow_origins=["*"],
                        allow_origins=origins,
                        allow_credentials=True,
                        allow_methods=["*"],
                        allow_headers=["*"],
                   )

app.include_router(router=router, prefix='/v1')

if __name__ == '__main__':
    uvicorn.run('app.main:main_app', reload=True)
