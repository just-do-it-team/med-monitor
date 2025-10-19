import os
import glob
import zipfile
from datetime import datetime
import polars as pl
import numpy as np
from starlette.responses import JSONResponse
from itertools import groupby
from scipy.interpolate import interp1d
from scipy.signal import medfilt
from scipy.signal import find_peaks
from sqlalchemy import text
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
os.environ["POLARS_MAX_THREADS"] = "6"


def interpolate(signal):
    isnan = np.isnan(signal)
    gaps = []
    for k, group in groupby(enumerate(isnan), key=lambda x: x[1]):
        if k:
            indices = [i for i, _ in group]
            gaps.append((indices[0], indices[-1]))
    signal_filled = signal.copy()
    for start, end in gaps:
        gap_len = end - start + 1
        left = start - 1
        right = end + 1
        if left >= 0 and right < len(signal):
            if gap_len <= 6:
                f = interp1d([left, right], [signal[left], signal[right]])
                signal_filled[start:end + 1] = f(np.arange(start, end + 1))
    return signal_filled


def baseline_heart_rate_median(signal, kernel_size=51):
    if np.count_nonzero(np.isnan(signal)) < 30:
        return medfilt(signal, kernel_size=kernel_size)
    else:
        return 0


async def upload_patient_data(session, data):
    assertion_error = "В папках не равное количество файлов"
    try:
        name = data.filename
        zip_file_path = os.path.join(os.getenv("BASEDIR"), f"uploaded_data/{name}")
        with open(zip_file_path, 'wb') as f:
            f.write(data.file.read())
        with zipfile.ZipFile(zip_file_path, 'r') as zip_object:
            zip_object.extractall(path=os.path.join(os.getenv("BASEDIR"), f"uploaded_data/"))
        data_path = os.path.join(os.getenv("BASEDIR"), f"uploaded_data/")
        bpm_files = glob.glob(f'{data_path}{name.split('.')[0]}/bpm/*.csv')
        uc_files = glob.glob(f'{data_path}{name.split('.')[0]}/uterus/*.csv')
        assert len(bpm_files) == len(uc_files), assertion_error
        timestamp = (datetime.now().strftime('%Y-%m-%d_%H-%M-%S'), datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        current_date = datetime.now().strftime("%Y.%m.%d")
        stmt = text(f"""insert into patients ("lastName", name, surname, type, "folderId", "birthDate")
        values ('Загруженный', 'пациент', '{timestamp[0]}', 'uploaded_data', '{name.split('.')[0]}', '{current_date}')""")
        await session.execute(stmt)
        await session.commit()
        stmt2 = text("select id from patients order by id desc limit 1")
        res = await session.execute(stmt2)
        res_id = res.fetchone()[0]
        max_sec = 0
        frames = []
        for i in range(len(bpm_files)):
            bpm = pl.read_csv(sorted(bpm_files)[i])
            uc = pl.read_csv(sorted(uc_files)[i])
            time1 = bpm['time_sec'].unique()
            time2 = uc['time_sec'].unique()
            bpm = bpm.join(uc, on='time_sec', how="full")
            bpm = bpm.with_columns(time=pl.Series('time_sec', sorted(list(set(time1.extend(time2))))))
            bpm = bpm.drop(['time_sec', 'time_sec_right'])
            bpm = bpm.rename({'value': 'fhr', 'value_right': 'uc'})
            bpm = bpm.with_columns(pl.col("time").cast(pl.Int32))
            bpm = bpm.with_columns(pl.col('time') + max_sec)
            frames.append(bpm)
            max_sec = bpm['time'].max()

        all = pl.concat(frames)
        all = all.sort('time')
        os.makedirs(f"ctg_dir/{res_id}", exist_ok=True)
        filepath_full = f"ctg_dir/{res_id}/full{timestamp[0]}.parquet"
        all.write_parquet(filepath_full)
        all = all.group_by("time").agg(pl.col('fhr').mean(), pl.col('uc').mean())
        all = all.sort('time')
        median_fhr = all.select(pl.median('fhr')).item()
        all = all.with_columns(fhr=(pl.when((pl.col('fhr') > median_fhr * 1.35) | (pl.col('fhr') < median_fhr * 0.65) |
                                            (pl.col('fhr') * 0.75 > pl.col('fhr').shift(1)) |
                                            (pl.col('fhr') * 1.25 < pl.col('fhr').shift(-1))).then(
            pl.lit(None)).otherwise(pl.col('fhr'))),
                               uc=(pl.when((pl.col('uc') * 0.75 > pl.col('uc').shift(1)) |
                                           (pl.col('uc') * 1.25 < pl.col('uc').shift(-1))).then(pl.lit(None)).otherwise(
                                   pl.col('uc'))))
        full_time = pl.DataFrame({"time": np.arange(all.select(pl.col("time").max()).item() + 1)})
        all = full_time.join(all, on='time', how='left')
        fhr_interpolate = interpolate(all['fhr'].to_numpy())
        uc_interpolate = interpolate(all['uc'].to_numpy())
        all = all.with_columns(fhr=fhr_interpolate, uc=uc_interpolate)
        decs_determination_sec = []
        ucs_determination_sec = []
        full_by_second = {'fhr': [], 'uc': [], 'time': []}
        status = {'basal': 999, 'var': 999, 'ucs': 999, 'decs': 999, 'accs': 999}
        decs = {"decelsEarly": 0, "decelsLate": 0, "decelsVarGood": 0, "decelsVarBad": 0}
        sec_counter = 0
        for i in all[:].iter_rows():
            try:
                fhr = float(i[1])
                full_by_second['fhr'].append(fhr)
            except:
                full_by_second['fhr'].append(np.nan)
            try:
                uc = float(i[2])
                full_by_second['uc'].append(uc)
            except:
                full_by_second['uc'].append(np.nan)
            full_by_second['time'].append(sec_counter)
            sec_counter += 1
            if sec_counter > 60 and sec_counter % 5 == 0:
                try:
                    baseline = baseline_heart_rate_median(np.array(full_by_second['fhr'][-120:]))
                    diff = np.max(baseline[30:-30]) - np.min(baseline[30:-30])
                    delta = np.nanmax(full_by_second['fhr'][-90:-30]) - np.nanmin(full_by_second['fhr'][-90:-30])
                    if diff < 7 and delta <= 40:
                        basal_value = round(np.mean(baseline) / 5) * 5
                        status['basal'] = basal_value
                        if len(full_by_second['fhr']) > 60:
                            percentille_diff = (np.nanpercentile(full_by_second['fhr'][-90:-30], 95) -
                                                np.nanpercentile(full_by_second['fhr'][-90:-30], 5))
                            status['var'] = round(percentille_diff / 5) * 5
                except Exception as e:
                    # print(":", e)
                    pass
                peaks_ucs, ucs_prop = find_peaks(np.array(full_by_second['uc'][-600:]), prominence=15, height=10,
                                                 width=(20, 110))
                if len(ucs_prop['right_bases']) != 0 and ucs_prop['right_bases'][-1] > 594:
                    try:
                        if sec_counter - ucs_determination_sec[-1][1] > 30:
                            ucs_determination_sec.append(
                                [int(sec_counter - (600 - ucs_prop['left_bases'][-1])), sec_counter])
                    except:
                        ucs_determination_sec.append(
                            [int(sec_counter - (600 - ucs_prop['left_bases'][-1])), sec_counter])
                status['ucs'] = len(peaks_ucs)
                if status['basal'] != 999 and status['var'] != 999 and sec_counter > 60:
                    peaks_accs, accs_prop = find_peaks(np.array(full_by_second['fhr'][-600:]), prominence=15,
                                                       height=status['basal'], width=(15, 90), distance=30)
                    peaks_decs, decs_prop = find_peaks(-np.array(full_by_second['fhr'][-600:]), prominence=15,
                                                       height=-status['basal'], width=(30, 120), distance=30)
                    if len(decs_prop['right_bases']) != 0 and decs_prop['right_bases'][-1] > 594:
                        try:
                            if sec_counter - decs_determination_sec[-1][1] > 30:
                                decs_determination_sec.append(
                                    [int(sec_counter - (600 - decs_prop['left_bases'][-1])), sec_counter])
                                if len(ucs_determination_sec) != 0 and sec_counter - ucs_determination_sec[-1][1] < 3:
                                    decs['decelsEarly'] += 1
                                elif len(ucs_determination_sec) != 0 and sec_counter - ucs_determination_sec[-1][
                                    1] < 60:
                                    decs['decelsLate'] += 1
                                else:
                                    decs['decelsVarBad'] += 1
                        except:
                            decs_determination_sec.append(
                                [int(sec_counter - (600 - decs_prop['left_bases'][-1])), sec_counter])
                            if len(ucs_determination_sec) != 0 and sec_counter - ucs_determination_sec[-1][1] < 3:
                                decs['decelsEarly'] += 1
                            elif len(ucs_determination_sec) != 0 and sec_counter - ucs_determination_sec[-1][1] < 60:
                                decs['decelsLate'] += 1
                            else:
                                decs['decelsVarBad'] += 1
                    status['accs'] = len(peaks_accs)
                    status['decs'] = len(peaks_decs)
        d = np.zeros(len(all)).astype(int)
        for i in decs_determination_sec:
            d[i[0]:i[1]] = 1
        u = np.zeros(len(all)).astype(int)
        for i in ucs_determination_sec:
            u[i[0]:i[1]] = 1
        all = all.with_columns(fl=np.char.add(u.astype(str), d.astype(str)).astype('<U2'))
        filename = f'by_second{timestamp[0]}.parquet'
        filepath_full_by_second = f"ctg_dir/{res_id}/{filename}"
        all = all.sort('time')
        m = all.select(pl.col("time").max()).item()
        full_time = pl.DataFrame({"time": np.arange(m + 1)})
        all = full_time.join(all, on='time', how='left')
        all.write_parquet(filepath_full_by_second)
        stmt3 = text(f'''insert into ctg ("patientId", "createDate", valid, basal, variability, accels, "decelsEarly",
            "decelsLate", "decelsVarGood", "decelsVarBad", filename) 
            values ({res_id}, '{timestamp[1]}', true, {status['basal']}, {status['var']}, {status['accs']},
            {decs["decelsEarly"]}, {decs["decelsLate"]}, {decs["decelsVarGood"]}, {decs["decelsVarBad"]}, '{filename}')''')
        await session.execute(stmt3)
        await session.commit()
        return JSONResponse(content={"message": "success"}, status_code=200)
    except AssertionError:
        return JSONResponse(content={"message": assertion_error}, status_code=501)
    except zipfile.BadZipFile:
        return JSONResponse(content={"message": "Ошибка при открытии архива"}, status_code=501)
