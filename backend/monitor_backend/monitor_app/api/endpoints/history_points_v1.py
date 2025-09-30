from typing import Annotated
from os import getenv
from fastapi import APIRouter, HTTPException, Body, Depends, File, WebSocket
from core.db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession

from ..methods.history_methods_v1 import get_history, load_ctg

history_router = APIRouter()


@history_router.get('/get_history')
async def get_patient_history(
        patient_id: int,
        history_id: int | None = None,
        page: int = 1,
        pagesize: int = 10,
        session: AsyncSession = Depends(get_async_session),
):
    return await get_history(patient_id, history_id, session, page, pagesize)


@history_router.get('/load_ctg')
async def load_ctg_from_history(
        patient_id: int,
        history_id: int,
        start_point: int | None = 0,
        session: AsyncSession = Depends(get_async_session),
):
    return await load_ctg(patient_id, history_id, start_point, session)

