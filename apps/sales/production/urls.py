from django.urls import path
from apps.sales.production.views import (
    BOMList, BOMCreate, BOMDetail, BOMUpdate, BOMListAPI, BOMDetailAPI,
)

urlpatterns = [
    path('list', BOMList.as_view(), name='BOMList'),
    path('create', BOMCreate.as_view(), name='BOMCreate'),
    path('detail/<str:pk>', BOMDetail.as_view(), name='BOMDetail'),
    path('update/<str:pk>', BOMUpdate.as_view(), name='BOMUpdate'),
    path('api', BOMListAPI.as_view(), name='BOMListAPI'),
    path('api/<str:pk>', BOMDetailAPI.as_view(), name='BOMDetailAPI')
]
