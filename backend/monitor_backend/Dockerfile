FROM python:3.12

COPY .env ./monitor_app/
COPY ./monitor_app ./monitor_app/
COPY requirements.txt /monitor_app/

WORKDIR /monitor_app/

RUN pip install -r requirements.txt && \
    apt-get update && \
    apt-get install nano

EXPOSE 8900

CMD ["uvicorn", "monitor_main:app", "--reload", "--host", "0.0.0.0", "--port", "8900"]