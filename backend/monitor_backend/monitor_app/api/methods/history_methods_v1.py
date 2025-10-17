import os
import json
import polars as pl
from starlette.responses import JSONResponse
from sqlalchemy import text
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())


async def get_history(patient_id, history_id, session, page, pagesize):
    limit = page * pagesize
    offset = (page - 1) * pagesize
    if history_id:
        stmt = text(f'select * from ctg where id = {history_id}')
        res_get_history = await session.execute(stmt)
        history = res_get_history.one()
        return JSONResponse(content=jsonable_encoder(history._asdict()), status_code=200)
    else:
        stmt = text(f'select * from ctg where "patientId" = {patient_id} order by id')
        res_get_history = await session.execute(stmt)
        history = res_get_history.all()
        history_list = [i._asdict() for i in history]
        return JSONResponse(content={"items": jsonable_encoder(history_list[offset:limit]), "total": len(history_list)}, status_code=200)


async def load_ctg(patient_id, history_id, start_point, session):
    stmt = text(f'select filename from ctg where id = {history_id}')
    res_get_ctg_filename = await session.execute(stmt)
    filename = res_get_ctg_filename.fetchone()[0]
    filepath = os.path.join(os.getenv("BASEDIR"), f"ctg_dir/{patient_id}/{filename}")
    df = pl.read_parquet(filepath)[start_point * 60:start_point * 60 + 1800]
    if len(df) != 0:
        df = df.with_columns(pl.col('time') / 60).fill_nan(None)
    return JSONResponse(content=df.to_dicts(), status_code=200)


async def get_last_id(patient_id, session):
    stmt = text(f'select * from ctg where "patientId" = {patient_id} order by id desc limit 1')
    res_get_last_id = await session.execute(stmt)
    last_row = res_get_last_id.fetchone()
    if last_row:
        return JSONResponse(content=jsonable_encoder(last_row._asdict()), status_code=200)
    else:
        return JSONResponse(content='', status_code=200)
