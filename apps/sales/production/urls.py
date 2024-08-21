from django.urls import path
from apps.sales.production.views import (
    BOMList, BOMCreate, BOMDetail, BOMUpdate, BOMListAPI, BOMDetailAPI, LaborListForBOMAPI,
)

urlpatterns = [
    path('bill-of-material/list', BOMList.as_view(), name='BOMList'),
    path('bill-of-material/create', BOMCreate.as_view(), name='BOMCreate'),
    path('bill-of-material/detail/<str:pk>', BOMDetail.as_view(), name='BOMDetail'),
    path('bill-of-material/update/<str:pk>', BOMUpdate.as_view(), name='BOMUpdate'),
    path('bill-of-material/api', BOMListAPI.as_view(), name='BOMListAPI'),
    path('bill-of-material/api/<str:pk>', BOMDetailAPI.as_view(), name='BOMDetailAPI'),

    path('bill-of-material/labor-for-BOM/api', LaborListForBOMAPI.as_view(), name='LaborListForBOMAPI'),
]
