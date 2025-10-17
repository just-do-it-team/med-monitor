from fastapi import APIRouter, HTTPException, Body, Depends, UploadFile, File
from core.db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from ..methods.upload_methods import upload_patient_data


upload_router = APIRouter()


@upload_router.post('/upload_patient_data')
async def upload_data(
        session: AsyncSession = Depends(get_async_session),
        data: UploadFile = File(None),
):
    return await upload_patient_data(session, data)
