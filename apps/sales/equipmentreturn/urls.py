from django.urls import path
from apps.sales.equipmentreturn.views import (
    EquipmentReturnList, EquipmentReturnCreate, EquipmentReturnDetail, EquipmentReturnUpdate,
    EquipmentReturnListAPI, EquipmentReturnDetailAPI,
)

urlpatterns = [
    path('list', EquipmentReturnList.as_view(), name='EquipmentReturnList'),
    path('create', EquipmentReturnCreate.as_view(), name='EquipmentReturnCreate'),
    path('detail/<str:pk>', EquipmentReturnDetail.as_view(), name='EquipmentReturnDetail'),
    path('update/<str:pk>', EquipmentReturnUpdate.as_view(), name='EquipmentReturnUpdate'),
    path('list/api', EquipmentReturnListAPI.as_view(), name='EquipmentReturnListAPI'),
    path('detail/api/<str:pk>', EquipmentReturnDetailAPI.as_view(), name='EquipmentReturnDetailAPI'),
]
