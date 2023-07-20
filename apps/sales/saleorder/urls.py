from django.urls import path

from apps.sales.saleorder.views import (
    SaleOrderCreate, SaleOrderList, SaleOrderListAPI, SaleOrderDetail, SaleOrderListAPIForCashOutFlow,
    SaleOrderDetailAPI, SaleOrderProductListAPI, SaleOrderDetailDeliveryAPI, SaleOrderConfigDetail,
    SaleOrderConfigDetailAPI, SaleOrderIndicatorListAPI, SaleOrderIndicatorDetailAPI, SaleOrderIndicatorRestoreAPI
)

urlpatterns = [
    path('config', SaleOrderConfigDetail.as_view(), name='SaleOrderConfigDetail'),
    path('config/api', SaleOrderConfigDetailAPI.as_view(), name='SaleOrderConfigDetailAPI'),
    path('indicators/api', SaleOrderIndicatorListAPI.as_view(), name='SaleOrderIndicatorListAPI'),
    path('indicator-api/<str:pk>', SaleOrderIndicatorDetailAPI.as_view(), name='SaleOrderIndicatorDetailAPI'),
    path('indicator-restore-api/<str:pk>', SaleOrderIndicatorRestoreAPI.as_view(), name='SaleOrderIndicatorRestoreAPI'),

    path('lists', SaleOrderList.as_view(), name='SaleOrderList'),
    path('api/lists', SaleOrderListAPI.as_view(), name='SaleOrderListAPI'),
    path('create', SaleOrderCreate.as_view(), name='SaleOrderCreate'),
    path('detail/<str:pk>', SaleOrderDetail.as_view(), name='SaleOrderDetail'),
    path('detail-api/<str:pk>', SaleOrderDetailAPI.as_view(), name='SaleOrderDetailAPI'),
    path('sale-order-product-list', SaleOrderProductListAPI.as_view(), name='SaleOrderProductListAPI'),
    path('detail-api/<str:pk>/delivery', SaleOrderDetailDeliveryAPI.as_view(), name='SaleOrderDetailDeliveryAPI'),
    path('api/list-for-cashoutflow', SaleOrderListAPIForCashOutFlow.as_view(), name='SaleOrderListAPIForCashOutFlow'),
]
