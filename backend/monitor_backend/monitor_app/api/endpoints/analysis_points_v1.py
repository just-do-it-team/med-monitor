from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from core.db import get_async_session
from fastapi import APIRouter, Depends

from ..methods.analysis_methods_v1 import start_analysis

analysis_router = APIRouter()


@analysis_router.get('/start_analysis')
async def analysis(
        patient_id: int,
        history_id: int,
        session: Annotated[AsyncSession, Depends(get_async_session)]
):
    return await start_analysis(patient_id, history_id, session)

