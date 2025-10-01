import os
from datetime import datetime
import websockets
import asyncio
import polars as pl
import numpy as np
from starlette.responses import JSONResponse
from sqlalchemy import text
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())


second = {'fhr': [], 'uc': []}
full = {'fhr': [], 'uc': [], 'time': []}
full_by_second = {'fhr': [], 'uc': [], 'time': []}
status = {'basal': '', 'var': '', 'uc': '', 'decs': '', 'accs': ''}


async def receiver(url, websocket):
    try:
        async with websockets.connect(url) as ws:
            async for message in ws:
                if message.split('=')[0] == 'null':
                    second['uc'].append(float(message.split('=')[1]))
                    full['fhr'].append(np.nan)
                    full['uc'].append(float(message.split('=')[1]))
                    full['time'].append(float(message.split('=')[2]))
                elif message.split('=')[1] == 'null':
                    second['fhr'].append(float(message.split('=')[0]))
                    full['fhr'].append(float(message.split('=')[0]))
                    full['uc'].append(np.nan)
                    full['time'].append(float(message.split('=')[2]))
                else:
                    second['fhr'].append(float(message.split('=')[0]))
                    second['uc'].append(float(message.split('=')[1]))
                    full['fhr'].append(float(message.split('=')[0]))
                    full['uc'].append(float(message.split('=')[1]))
                    full['time'].append(float(message.split('=')[2]))
            await websocket.close()
    except Exception as e:
        await websocket.close()
        print(f"Caught exception: {e}")


async def ticker(websocket):
    await websocket.accept()
    try:
        sec_counter = 0
        while True:
            await asyncio.sleep(1)
            try:
                fhr = round(sum(second['fhr']) / len(second['fhr']))
            except ZeroDivisionError:
                fhr = 'null'
            try:
                uc = round(sum(second['uc']) / len(second['uc']))
            except ZeroDivisionError:
                uc = 'null'
            await websocket.send_text(f'{{"time":{sec_counter}, "fhr": {fhr}, "uc": {uc}}}')
            full_by_second['fhr'].append(fhr)
            full_by_second['uc'].append(uc)
            full_by_second['time'].append(sec_counter)
            sec_counter += 1
            # print(sec_counter, fhr, uc)
            second['fhr'] = []
            second['uc'] = []
    except Exception as e:
        print("WebSocket closed:", e)
        await websocket.close()


async def ws_dashboard(websocket, ctg_type, folder_id, patient_id, session):
    url = f'ws://127.0.0.1:8001/ws_data/{ctg_type}/{folder_id}'
    tasks = [asyncio.create_task(ticker(websocket)), asyncio.create_task(receiver(url, websocket))]
    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    for task in pending:
        task.cancel()
    # os.makedirs(os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}"), exist_ok=True)  #TODO
    # filepath_full = os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}/full{timestamp}.parquet")  #TODO
    os.makedirs(f"ctg_dir/{patient_id}", exist_ok=True)
    timestamp = (datetime.now().strftime('%Y-%m-%d_%H-%M-%S'), datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    filepath_full = (f"ctg_dir/{patient_id}/full{timestamp[0]}.parquet")
    full_df = pl.LazyFrame(schema={'time': pl.Float64, 'fhr': pl.Float64, 'uc': pl.Float64}, data=full)
    full_df.sink_parquet(filepath_full)
    full['fhr'] = []
    full['uc'] = []
    filename = f'by_second{timestamp[0]}.parquet'
    # filepath_full_by_second = os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}/full.parquet")  #TODO
    filepath_full_by_second = (f"ctg_dir/{patient_id}/{filename}")
    full_by_second_df = pl.LazyFrame(schema={'time': pl.Int16, 'fhr': pl.Int16, 'uc': pl.Int16}, data=full_by_second)
    full_by_second_df.sink_parquet(filepath_full_by_second)
    full_by_second['fhr'] = []
    full_by_second['uc'] = []
    # valid =
    # stmt = text(f'''insert into ctg ("patientId", "createDate", valid, basal, variability, accels, "decelsEarly",
    # "decelsLate", "decelsVarGood", "decelsVarBad", filename) values ({patient_id}, {timestamp}, {valid}, {basal}''')
    stmt = text(f"""insert into ctg ("patientId", "createDate", valid, filename) values ({patient_id}, '{timestamp[1]}', true, '{filename}')""")
    await session.execute(stmt)
    await session.commit()


async def get_doctors(session):
    stmt = text("select * from doctors")
    res_get_doctors = await session.execute(stmt)
    doctors = res_get_doctors.all()
    doctors_list = [i._asdict() for i in doctors]
    for emp in doctors_list:
        emp['fullName'] = ' '.join([emp['lastName'], emp['name'], emp['surname']])
        emp.pop('lastName')
        emp.pop('name')
        emp.pop('surname')
    return JSONResponse(content=doctors_list, status_code=200)


async def get_patients(session):
    stmt = text("select * from patients")
    res_get_patients = await session.execute(stmt)
    patients = res_get_patients.all()
    patients_list = [i._asdict() for i in patients]
    for emp in patients_list:
        emp['fullName'] = ' '.join([emp['lastName'], emp['name'], emp['surname']])
        emp.pop('lastName')
        emp.pop('name')
        emp.pop('surname')
    return JSONResponse(content=patients_list, status_code=200)


# async def to_status(websocket):
#     websocket.accept()
#     try:
#         sec_counter = 0
#         while True:
#             await asyncio.sleep(2)
#             await websocket.send_text(f'{{"time":{sec_counter}, "fhr": {fhr}, "uc": {uc}}}')
#     except Exception as e:
#         print("WebSocket closed:", e)
#         await websocket.close()