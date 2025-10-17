from fastapi import APIRouter

from .endpoints.dashboard_points_v1 import dashboard_router
from .endpoints.history_points_v1 import history_router
from .endpoints.analysis_points_v1 import analysis_router
from .endpoints.upload_points import upload_router


router = APIRouter()

router.include_router(router=dashboard_router, prefix='/dashboard', tags=['Дашборд'])
router.include_router(router=history_router, prefix='/history', tags=['История исследований'])
router.include_router(router=analysis_router, prefix='/analysis', tags=['Анализ'])
router.include_router(router=upload_router, prefix='/upload', tags=['Загрузка'])