from django.urls import path
from apps.sales.equipmentloan.views import (
    EquipmentLoanList, EquipmentLoanCreate, EquipmentLoanDetail, EquipmentLoanUpdate,
    EquipmentLoanListAPI, EquipmentLoanDetailAPI,
    ELProductListAPI, ELWarehouseListByProductAPI, ELProductLotListAPI, ELProductSerialListAPI
)

urlpatterns = [
    path('list', EquipmentLoanList.as_view(), name='EquipmentLoanList'),
    path('create', EquipmentLoanCreate.as_view(), name='EquipmentLoanCreate'),
    path('detail/<str:pk>', EquipmentLoanDetail.as_view(), name='EquipmentLoanDetail'),
    path('update/<str:pk>', EquipmentLoanUpdate.as_view(), name='EquipmentLoanUpdate'),
    path('list/api', EquipmentLoanListAPI.as_view(), name='EquipmentLoanListAPI'),
    path('detail/api/<str:pk>', EquipmentLoanDetailAPI.as_view(), name='EquipmentLoanDetailAPI'),
    path('el-product-list/api', ELProductListAPI.as_view(), name='ELProductListAPI'),
    path('el-warehouse-list-by-product/api', ELWarehouseListByProductAPI.as_view(), name='ELWarehouseListByProductAPI'),
    path('el-product-lot-list/api', ELProductLotListAPI.as_view(), name='ELProductLotListAPI'),
    path('el-product-serial-list/api', ELProductSerialListAPI.as_view(), name='ELProductSerialListAPI'),
]
