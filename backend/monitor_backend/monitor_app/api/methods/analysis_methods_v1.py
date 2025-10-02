import os

from sqlalchemy import text
from starlette.responses import JSONResponse
import joblib
import polars as pl
from scipy.signal import find_peaks
import numpy as np
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())


async def start_analysis(patient_id, history_id, session):
    stmt = text(f'select filename from ctg where id = {history_id}')
    res_get_ctg_filename = await session.execute(stmt)
    filename = res_get_ctg_filename.fetchone()[0][9:]
    filepath = os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}/full{filename}")
    loaded_model = joblib.load(os.path.join(os.getenv("BASEDIR"), "RF_model.pkl"))
    decs_width = 60
    accs_width = 20
    bpm = pl.read_parquet(filepath)
    bpm = bpm.with_columns(pl.col("time").cast(pl.Int32)).group_by("time").agg(pl.col('fhr').mean(),
                                                                               pl.col('uc').mean(),
                                                                               fhrmax=pl.col('fhr').max(),
                                                                               fhrmin=pl.col('fhr').min()).sort('time')
    median_fhr = bpm.select(pl.median('fhr')).item()
    all = bpm.with_columns(fhr=(pl.when((pl.col('fhr') > median_fhr * 1.35) | (pl.col('fhr') < median_fhr * 0.65) |
                                        (pl.col('fhrmax') > pl.col('fhrmin') * 1.2) |
                                        (pl.col('fhrmax') * 0.8 > pl.col('fhrmin')) |
                                        (pl.col('fhr') * 0.75 > pl.col('fhr').shift(1)) |
                                        (pl.col('fhr') * 1.25 < pl.col('fhr').shift(-1))).then(pl.lit(None)).otherwise(
        pl.col('fhr'))), uc=(pl.when((pl.col('uc') * 0.75 > pl.col('uc').shift(1)) |
                    (pl.col('uc') * 1.25 < pl.col('uc').shift(-1))).then(pl.lit(None)).otherwise(pl.col('uc'))))
    all = all.drop_nulls(subset='fhr')
    mean = all.get_column('fhr').mean()
    peaks_accs, accs_prop = find_peaks(all.get_column('fhr').to_numpy(), prominence=15, height=mean, width=accs_width)
    peaks_decs, decs_prop = find_peaks(-all.get_column('fhr').to_numpy(), prominence=15, height=-mean, width=decs_width)
    peaks_ucs, ucs_prop = find_peaks(all.get_column('uc').to_numpy(), prominence=25, height=10, width=25)
    ltv = all.with_columns(for_stv=pl.col('time') // 60).group_by(pl.col('for_stv')).agg(
        diff=(pl.col('fhrmin').max() - pl.col('fhrmax').min())).with_columns(pl.col('diff') > 10)
    low_ltv = all.with_columns(for_stv=pl.col('time') // 60).group_by(pl.col('for_stv')).agg(
        diff=(pl.col('fhrmin').max() - pl.col('fhrmax').min())).with_columns(pl.col('diff') < 3)
    stv = all.with_columns(for_stv=pl.col('time') // 4).group_by(pl.col('for_stv')).agg(
        diff=(pl.col('fhrmin').max() - pl.col('fhrmax').min())).with_columns(pl.col('diff') > 3)
    lowstv = all.with_columns(for_stv=pl.col('time') // 4).group_by(pl.col('for_stv')).agg(
        diff=(pl.col('fhrmin').max() - pl.col('fhrmax').min())).with_columns(pl.col('diff') < 1)
    X_test = np.array([[mean, sum(accs_prop['widths']) / len(all), sum(decs_prop['widths']) / len(all),
                        sum(ucs_prop['widths']) / len(all), ltv['diff'].mean(), stv['diff'].mean(),
                        low_ltv['diff'].mean(), lowstv['diff'].mean()]])
    y_pred = loaded_model.predict(X_test)[0]
    if y_pred == 0:
        decision = 'В исследовании не обнаружено признаков указывающих на гипоксию плода'
    else:
        decision = 'В исследовании обнаружены признаки гипоксии плода'
    d = {'decision': decision}
    stmt2 = text(f"update ctg set analysis = '{decision}' where id = {history_id}")
    await session.execute(stmt2)
    await session.commit()
    return JSONResponse(content=d, status_code=200)
