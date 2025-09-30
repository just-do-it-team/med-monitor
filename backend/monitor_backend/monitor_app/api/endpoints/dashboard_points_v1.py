from typing import Annotated
from os import getenv
from fastapi import APIRouter, HTTPException, Body, Depends, File, WebSocket
from core.db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from starlette import status
from starlette.requests import Request
from ..methods.dashboard_methods_v1 import ws_dashboard, get_patients, get_doctors, to_status

dashboard_router = APIRouter()


@dashboard_router.get('/get_patients')
async def patients(
        session: Annotated[AsyncSession, Depends(get_async_session)]
):
    return await get_patients(session)


@dashboard_router.get('/get_doctors')
async def doctors(
        session: Annotated[AsyncSession, Depends(get_async_session)]
):
    return await get_doctors(session)


@dashboard_router.websocket("/to_chart/{ctg_type}/{folder_id}/{patient_id}")
async def to_chart(
        ctg_type: str,
        folder_id: int,
        patient_id: int,
        websocket: WebSocket,
        session: AsyncSession = Depends(get_async_session),
):
    await ws_dashboard(websocket, ctg_type, folder_id, patient_id, session)


@dashboard_router.websocket("/to_status")
async def status(
        websocket: WebSocket,
):
    await to_status(websocket)
