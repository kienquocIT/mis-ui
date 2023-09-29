from django.urls import path

from apps.sales.saleorder.views import (
    SaleOrderCreate, SaleOrderList, SaleOrderListAPI, SaleOrderDetail,
    SaleOrderDetailAPI, SaleOrderExpenseListAPI, SaleOrderDetailDeliveryAPI, SaleOrderConfigDetail,
    SaleOrderConfigDetailAPI, SaleOrderIndicatorListAPI, SaleOrderIndicatorDetailAPI, SaleOrderIndicatorRestoreAPI,
    ProductListSaleOrderAPI, SaleOrderUpdate, SaleOrderListForCashOutflowAPI
)

urlpatterns = [
    path('config', SaleOrderConfigDetail.as_view(), name='SaleOrderConfigDetail'),
    path('config/api', SaleOrderConfigDetailAPI.as_view(), name='SaleOrderConfigDetailAPI'),
    path('indicators/api', SaleOrderIndicatorListAPI.as_view(), name='SaleOrderIndicatorListAPI'),
    path('indicator-api/<str:pk>', SaleOrderIndicatorDetailAPI.as_view(), name='SaleOrderIndicatorDetailAPI'),
    path('indicator-restore-api/<str:pk>', SaleOrderIndicatorRestoreAPI.as_view(), name='SaleOrderIndicatorRestoreAPI'),

    path('lists', SaleOrderList.as_view(), name='SaleOrderList'),
    path('list-for-cashoutflow', SaleOrderListForCashOutflowAPI.as_view(), name='SaleOrderListForCashOutflowAPI'),
    path('api/lists', SaleOrderListAPI.as_view(), name='SaleOrderListAPI'),
    path('create', SaleOrderCreate.as_view(), name='SaleOrderCreate'),
    path('detail/<str:pk>', SaleOrderDetail.as_view(), name='SaleOrderDetail'),
    path('detail-api/<str:pk>', SaleOrderDetailAPI.as_view(), name='SaleOrderDetailAPI'),
    path('update/<str:pk>', SaleOrderUpdate.as_view(), name='SaleOrderUpdate'),
    path('sale-order-expense-list', SaleOrderExpenseListAPI.as_view(), name='SaleOrderExpenseListAPI'),
    path('detail-api/<str:pk>/delivery', SaleOrderDetailDeliveryAPI.as_view(), name='SaleOrderDetailDeliveryAPI'),
    path('product/list/api/<str:pk>', ProductListSaleOrderAPI.as_view(), name='ProductListSaleOrderAPI')
]
