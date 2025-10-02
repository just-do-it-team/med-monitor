import os
from datetime import datetime
import websockets
import asyncio
import copy
import polars as pl
import numpy as np
from scipy.signal import medfilt
from scipy.signal import find_peaks
from starlette.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import text
from dotenv import load_dotenv, find_dotenv
os.environ["POLARS_MAX_THREADS"] = "6"


load_dotenv(find_dotenv())

default_second = {'fhr': [], 'uc': []}
default_full_by_second = {'fhr': [], 'uc': [], 'time': []}
default_decs = {"decelsEarly": 0, "decelsLate": 0, "decelsVarGood": 0, "decelsVarBad": 0}
default_fetal_health_indications = {'basalValue': 999, 'basalStatus': 'Не определено', 'basalComment': '',
                            'varValue': 999, 'varStatus': 'Не определено', 'varComment': '',
                            'accsValue': 999, 'accsStatus': 'Не определено', 'accsComment': '',
                            'decsValue': 999, 'decsStatus': 'Не определено', 'decsComment': '',
                            'ucsValue': 999, 'ucsStatus': 'Не определено', 'ucsComment': '',
                            'overallStatus': 'Не определено'}
second = {'fhr': [], 'uc': []}
full = {'fhr': [], 'uc': [], 'time': []}
full_by_second = {'fhr': [], 'uc': [], 'time': []}
status = {'basal': 999, 'var': 999, 'ucs': 999, 'decs': 999, 'accs': 999}
decs = {"decelsEarly": 0, "decelsLate": 0, "decelsVarGood": 0, "decelsVarBad": 0}
decs_determination_sec = []
ucs_determination_sec = []
stv = []
lvt = []
fetal_health_indications = {"basalValue": 999, "basalStatus": "Не определено", "basalComment": "",
                            'varValue': 999, 'varStatus': 'Не определено', 'varComment': '',
                            'accsValue': 999, 'accsStatus': 'Не определено', 'accsComment': '',
                            'decsValue': 999, 'decsStatus': 'Не определено', 'decsComment': '',
                            'ucsValue': 999, 'ucsStatus': 'Не определено', 'ucsComment': '',
                            'overallStatus': 'Не определено'}


def baseline_heart_rate_median(signal, kernel_size=51):
    return medfilt(signal, kernel_size=kernel_size)


async def receiver(url, websocket):
    try:
        async with websockets.connect(url) as ws:
            decs["decelsEarly"] = 0
            decs["decelsLate"] = 0
            decs["decelsVarGood"] = 0
            decs["decelsVarBad"] = 0
            full['time'] = []
            full['fhr'] = []
            full['uc'] = []
            status['basal'] = 999
            status['var'] = 999
            status['ucs'] = 999
            status['decs'] = 999
            status['accs'] = 999
            full_by_second['fhr'] = []
            full_by_second['uc'] = []
            full_by_second['time'] = []
            decs_determination_sec.clear()
            ucs_determination_sec.clear()
            stv.clear()
            fetal_health_indications['basalValue'] = 999
            fetal_health_indications['basalStatus'] = "Не определено"
            fetal_health_indications['basalComment'] = ""
            fetal_health_indications['varValue'] = 999
            fetal_health_indications['varStatus'] = 'Не определено'
            fetal_health_indications['varComment'] = ''
            fetal_health_indications['accsValue'] = 999
            fetal_health_indications['accsStatus'] = 'Не определено'
            fetal_health_indications['accsComment'] = ''
            fetal_health_indications['decsValue'] = 999
            fetal_health_indications['decsStatus'] = 'Не определено'
            fetal_health_indications['decsComment'] = ''
            fetal_health_indications['ucsValue'] = 999
            fetal_health_indications['ucsStatus'] = 'Не определено'
            fetal_health_indications['ucsComment'] = ''
            fetal_health_indications['overallStatus'] = 'Не определено'
            async for message in ws:
                if message.split('=')[1] == 'null':
                    second['uc'].append(float(message.split('=')[2]))
                    full['fhr'].append(np.nan)
                    full['uc'].append(float(message.split('=')[2]))
                    full['time'].append(float(message.split('=')[0]))
                elif message.split('=')[2] == 'null':
                    second['fhr'].append(float(message.split('=')[1]))
                    full['fhr'].append(float(message.split('=')[1]))
                    full['uc'].append(np.nan)
                    full['time'].append(float(message.split('=')[0]))
                else:
                    second['fhr'].append(float(message.split('=')[1]))
                    second['uc'].append(float(message.split('=')[2]))
                    full['fhr'].append(float(message.split('=')[1]))
                    full['uc'].append(float(message.split('=')[2]))
                    full['time'].append(float(message.split('=')[0]))
            await websocket.close()
            ##
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
                full_by_second['fhr'].append(fhr)
            except ZeroDivisionError:
                fhr = 'null'
                full_by_second['fhr'].append(np.nan)
            try:
                uc = round(sum(second['uc']) / len(second['uc']))
                full_by_second['uc'].append(uc)
            except ZeroDivisionError:
                uc = 'null'
                full_by_second['uc'].append(np.nan)
            await websocket.send_text(f'''{{"time":{sec_counter/60}, "fhr": {fhr}, "uc": {uc}, "basal": {status['basal']},
            "var": {status['var']}, "ucs": {status['ucs']}, "decs": {status['decs']}, "accs": {status['accs']}}}''')
            full_by_second['time'].append(sec_counter)
            sec_counter += 1
            second['fhr'] = []
            second['uc'] = []
            if sec_counter % 5 == 0:
                try:
                    baseline = baseline_heart_rate_median(np.array(full_by_second['fhr'][-120:]))
                    diff = np.max(baseline[30:-30]) - np.min(baseline[30:-30])
                    if diff < 10:
                        status['basal'] = round(np.mean(baseline)/5)*5
                        if len(full_by_second['fhr']) > 60:
                            percentille_diff = (np.nanpercentile(full_by_second['fhr'][-90:-30], 95) -
                                                np.nanpercentile(full_by_second['fhr'][-90:-30], 5))
                            status['var'] = round(percentille_diff/5)*5
                # except ValueError:
                except Exception as e:
                    # print(":", e)
                    pass
                peaks_ucs, ucs_prop = find_peaks(np.array(full_by_second['uc'][-600:]), prominence=15, height=10, width=30)
                if len(ucs_prop['right_bases']) != 0 and ucs_prop['right_bases'][-1] > 594:
                    ucs_determination_sec.append(sec_counter)
                status['ucs'] = len(peaks_ucs)
                if status['basal'] != 999 and status['var'] != 999 and sec_counter > 60:
                    peaks_accs, accs_prop = find_peaks(np.array(full_by_second['fhr'][-600:]), prominence=15, height=status['basal'], width=15)
                    peaks_decs, decs_prop = find_peaks(-np.array(full_by_second['fhr'][-600:]), prominence=15, height=-status['basal'], width=30)
                    if len(decs_prop['right_bases']) != 0 and decs_prop['right_bases'][-1] > 594:
                        decs_determination_sec.append(sec_counter)
                        if sec_counter in ucs_determination_sec:
                            decs['decelsEarly'] +=1
                        else:
                            decs['decelsVarBad'] +=1  #TODO добавить определение остальных видов децелераций
                    status['accs'] = len(peaks_accs)
                    status['decs'] = len(peaks_decs)
                # pass
    except Exception as e:
        print("ticker closed:", e)
        # await websocket.close()


async def ws_dashboard(websocket, ctg_type, folder_id, patient_id, session):
    # url = f'ws://127.0.0.1:8001/ws_data/{ctg_type}/{folder_id}'
    url = f'{os.getenv("SENSORS_URL")}{ctg_type}/{folder_id}'
    tasks = [asyncio.create_task(ticker(websocket)), asyncio.create_task(receiver(url, websocket))]
    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    for task in pending:
        task.cancel()
    timestamp = (datetime.now().strftime('%Y-%m-%d_%H-%M-%S'), datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    # os.makedirs(os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}"), exist_ok=True)
    # filepath_full = os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}/full{timestamp}.parquet")
    os.makedirs(f"ctg_dir/{patient_id}", exist_ok=True)
    filepath_full = f"ctg_dir/{patient_id}/full{timestamp[0]}.parquet"
    full_df = pl.LazyFrame(schema={'time': pl.Float64, 'fhr': pl.Float64, 'uc': pl.Float64}, data=full)
    full_df.sink_parquet(filepath_full)
    full['fhr'] = []
    full['uc'] = []
    full['time'] = []
    filename = f'by_second{timestamp[0]}.parquet'
    # filepath_full_by_second = os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}/full.parquet")
    filepath_full_by_second = f"ctg_dir/{patient_id}/{filename}"
    full_by_second_df = pl.LazyFrame(schema={'time': pl.Float32, 'fhr': pl.Float32, 'uc': pl.Float32},
                                     data={'time': full_by_second['time'][:min(len(full_by_second['time']), len(full_by_second['fhr']))],
                                           'fhr': full_by_second['fhr'][:min(len(full_by_second['time']), len(full_by_second['fhr']))],
                                           'uc': full_by_second['uc'][:min(len(full_by_second['time']), len(full_by_second['fhr']))]})
    full_by_second_df.sink_parquet(filepath_full_by_second)
    valid = 'true' if len(full_by_second['fhr']) > int(os.getenv('MINIMUM_VALID_CTG_DURATION_SECOND')) else 'false'
    basal = 'null' if status['basal'] == 0 else status['basal']
    var = 'null' if status['var'] == 0 or status['var'] == np.nan else status['var']
    full_by_second['fhr'] = []
    full_by_second['uc'] = []
    full_by_second['time'] = []
    stmt = text(f'''insert into ctg ("patientId", "createDate", valid, basal, variability, accels, "decelsEarly",
    "decelsLate", "decelsVarGood", "decelsVarBad", filename) 
    values ({patient_id}, '{timestamp[1]}', {valid}, {basal}, {var}, {status['accs']},
    {decs['decelsEarly']}, {decs['decelsLate']}, {decs['decelsVarGood']}, {decs['decelsVarBad']}, '{filename}')''')
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
    return JSONResponse(content=jsonable_encoder(patients_list), status_code=200)


async def status_checker():
    status_sec_counter = 0
    while True:
        await asyncio.sleep(1)
        status_sec_counter += 1
        if status['basal'] != 999 and status['var'] != 999 and status_sec_counter > 120:
            # basal fhr
            if 110 < status['basal'] < 160:
                fetal_health_indications['basalValue'] = status['basal']
                fetal_health_indications['basalStatus'] = 'Нормальный'
            elif 180 > status['basal'] > 161 or 100 < status['basal'] < 109:
                fetal_health_indications['basalValue'] = status['basal']
                fetal_health_indications['basalStatus'] = 'Подозрительный'
                fetal_health_indications['basalComment'] = 'Необходимо наблюдение, действия по устранению обратимых причин'
            else:
                fetal_health_indications['basalValue'] = status['basal']
                fetal_health_indications['basalStatus'] = 'Патологический'
                fetal_health_indications['basalComment'] = 'Необходимо немедленное вмешательство для устранения обратимых причин'
            # variability
            if 5 < status['var'] <= 25:
                fetal_health_indications['varValue'] = status['var']
                fetal_health_indications['varStatus'] = 'Нормальный'
            elif status['var'] > 25 or status['basal'] < 5:  # TODO Добавить условие длительности
                fetal_health_indications['varValue'] = status['var']
                fetal_health_indications['varStatus'] = 'Подозрительный'
                fetal_health_indications['varComment'] = 'Необходимо наблюдение, действия по устранению обратимых причин'
            else:
                fetal_health_indications['varValue'] = status['var']
                fetal_health_indications['varStatus'] = 'Патологический'
                fetal_health_indications['varComment'] = 'Необходимо немедленное вмешательство для устранения обратимых причин'
            # accelerations
            if status['accs'] > 0:
                fetal_health_indications['accsValue'] = status['accs']
                fetal_health_indications['accsStatus'] = 'Нормальный'
                fetal_health_indications['accsComment'] = 'Наличие акселераций позитивный признак'
            # decelerations
            # if len([x for x in decs_determination_sec if x > status_sec_counter - 1800])


async def status_sender(websocket):
    await websocket.accept()
    await websocket.send_json(fetal_health_indications)
    try:
        # sec_counter = 0
        last = copy.deepcopy(fetal_health_indications)
        current = fetal_health_indications
        while True:
            await asyncio.sleep(5)
            # fetal_health_indications['accsValue'] += 1
            if current != last:
                await websocket.send_json(fetal_health_indications)
                last = copy.deepcopy(fetal_health_indications)
    except Exception as e:
        # await websocket.close()
        print("status_sender closed:", e)


async def to_status(websocket):
    try:
        tasks = [asyncio.create_task(status_checker()), asyncio.create_task(status_sender(websocket))]
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        for task in pending:
            task.cancel()
    except Exception as e:
        await websocket.close()
        print("WebSocket closed:", e)
    except asyncio.CancelledError:
        print('asyncio.CancelledError catched')

