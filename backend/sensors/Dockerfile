FROM python:3.12

COPY *.py /sensor/
COPY requirements.txt /sensor/
COPY ./data ./sensor/

WORKDIR /sensor/

RUN pip install -r requirements.txt && \
    apt-get update && \
    apt-get install nano

EXPOSE 8040

CMD ["uvicorn", "sensor_main:app", "--reload", "--host", "127.0.0.1", "--port", "8040"]