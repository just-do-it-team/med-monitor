import glob

import uvicorn
from fastapi import FastAPI, Body, WebSocket
import polars as pl
import time
import asyncio


app = FastAPI()


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
