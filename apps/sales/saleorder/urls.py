from django.urls import path

from apps.sales.saleorder.views import (
    SaleOrderCreate, SaleOrderList, SaleOrderListAPI, SaleOrderDetail,
    SaleOrderDetailAPI, SaleOrderDetailDeliveryAPI,
)

urlpatterns = [
    path('lists', SaleOrderList.as_view(), name='SaleOrderList'),
    path('api/lists', SaleOrderListAPI.as_view(), name='SaleOrderListAPI'),
    path('create', SaleOrderCreate.as_view(), name='SaleOrderCreate'),
    path('detail/<str:pk>', SaleOrderDetail.as_view(), name='SaleOrderDetail'),
    path('detail-api/<str:pk>', SaleOrderDetailAPI.as_view(), name='SaleOrderDetailAPI'),
    path('detail-api/<str:pk>/delivery', SaleOrderDetailDeliveryAPI.as_view(), name='SaleOrderDetailDeliveryAPI'),
]
