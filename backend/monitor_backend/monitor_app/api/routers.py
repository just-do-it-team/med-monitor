from fastapi import APIRouter

from .endpoints.dashboard_points_v1 import dashboard_router
from .endpoints.history_points_v1 import history_router


router = APIRouter()

router.include_router(router=dashboard_router, prefix='/dashboard', tags=['Дашборд'])
router.include_router(router=history_router, prefix='/history', tags=['История исследований'])
