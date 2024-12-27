from django.urls import path
from apps.sales.reconciliation.views import (
    ReconList, ReconCreate, ReconDetail, ReconUpdate,
    ReconListAPI, ReconDetailAPI
)

urlpatterns = [
    # reconciliation
    path('list', ReconList.as_view(), name='ReconList'),
    path('create', ReconCreate.as_view(), name='ReconCreate'),
    path('detail/<str:pk>', ReconDetail.as_view(), name='ReconDetail'),
    path('update/<str:pk>', ReconUpdate.as_view(), name='ReconUpdate'),
    path('api/list', ReconListAPI.as_view(), name='ReconListAPI'),
    path('api/<str:pk>', ReconDetailAPI.as_view(), name='ReconDetailAPI'),
]
