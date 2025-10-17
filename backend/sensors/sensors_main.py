import glob
import zipfile
from datetime import datetime
import uvicorn
from fastapi import FastAPI, Body, WebSocket, UploadFile, File
import polars as pl
import time
import asyncio

from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

app = FastAPI()

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

@app.websocket("/ws_data/{t}/{folder_id}")
async def websocket_endpoint(
        t: str,
        folder_id: int,
        websocket: WebSocket,
):
    await websocket.accept()
    bpm_files = glob.glob(f'data/{t}/{folder_id}/bpm/*.csv')
    uc_files = glob.glob(f'data/{t}/{folder_id}/uterus/*.csv')
    print(len(bpm_files), len(uc_files))
    assert len(bpm_files) == len(uc_files)
    max_sec = 0

    frames = []
    for i in range(len(bpm_files)):
        bpm = pl.read_csv(bpm_files[i])
        uc = pl.read_csv(uc_files[i])
        time1 = bpm['time_sec'].unique()
        time2 = uc['time_sec'].unique()
        bpm = bpm.join(uc, on='time_sec', how="full")
        bpm = bpm.with_columns(time=pl.Series('time_sec', sorted(list(set(time1.extend(time2))))))
        bpm = bpm.drop(['time_sec', 'time_sec_right'])
        bpm = bpm.rename({'time': 'time_sec', 'value': 'fhr', 'value_right': 'uc'})
        bpm = bpm.with_columns(pl.col('time_sec') + max_sec)
        frames.append(bpm)
        max_sec = bpm['time_sec'].max()

    all = pl.concat(frames)
    all = all.select(['time_sec', 'fhr', 'uc'])
    start_time = time.time()
    try:
        for row in all[:].iter_rows():
            current_time = time.time() - start_time
            wait_time = row[0] - current_time
            if row[1] is None:
                await websocket.send_text(f"{row[0]:.6f}=null={row[2]:.6f}")
                await asyncio.sleep(wait_time)
            elif row[2] is None:
                await websocket.send_text(f"{row[0]:.6f}={row[1]:.6f}=null")
                await asyncio.sleep(wait_time)
            else:
                await websocket.send_text(f"{row[0]:.6f}={row[1]:.6f}={row[2]:.6f}")
                await asyncio.sleep(wait_time)
        await websocket.close()
    except Exception as e:
        print("WebSocket closed:", e)


@app.post('/v1/upload_to_sensors/upload_patient_data')
async def upload_data(
        data: UploadFile = File(None),
):
    assertion_error = "В папках не равное количество файлов"
    try:
        name = data.filename
        data_path = "data/uploaded_data/"
        zip_file_path = f"{data_path}{name}"
        with open(zip_file_path, 'wb') as f:
            f.write(data.file.read())
        with zipfile.ZipFile(zip_file_path, 'r') as zip_object:
            zip_object.extractall(path=data_path)
        bpm_files = glob.glob(f'{data_path}{name}/bpm/*.csv')
        uc_files = glob.glob(f'{data_path}{name}/uterus/*.csv')
        assert len(bpm_files) == len(uc_files), assertion_error
        return JSONResponse(content={"message": "success"}, status_code=200)
    except AssertionError:
        return JSONResponse(content={"message": assertion_error}, status_code=501)
    except zipfile.BadZipFile:
        return JSONResponse(content={"message": "Ошибка при открытии архива"}, status_code=501)