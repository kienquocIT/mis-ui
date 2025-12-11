from django.urls import path
from apps.sales.arinvoice.views import (
    ARInvoiceList, ARInvoiceCreate, ARInvoiceDetail, ARInvoiceUpdate,
    ARInvoiceListAPI, ARInvoiceDetailAPI,
    DeliveryListForARInvoiceAPI, EZInvoiceDetail, ARInvoiceRecurrenceListAPI, SaleOrderListForARInvoiceAPI,
    LeaseOrderListForARInvoiceAPI
)

urlpatterns = [
    path('list', ARInvoiceList.as_view(), name='ARInvoiceList'),
    path('create', ARInvoiceCreate.as_view(), name='ARInvoiceCreate'),
    path('detail/<str:pk>', ARInvoiceDetail.as_view(), name='ARInvoiceDetail'),
    path('update/<str:pk>', ARInvoiceUpdate.as_view(), name='ARInvoiceUpdate'),
    path('list/api', ARInvoiceListAPI.as_view(), name='ARInvoiceListAPI'),
    path('detail/api/<str:pk>', ARInvoiceDetailAPI.as_view(), name='ARInvoiceDetailAPI'),
    path('ar-invoice-recurrence/list', ARInvoiceRecurrenceListAPI.as_view(), name='ARInvoiceRecurrenceListAPI'),
] + [
    path('sale-order/api', SaleOrderListForARInvoiceAPI.as_view(), name='SaleOrderListForARInvoiceAPI'),
    path('lease-order/api', LeaseOrderListForARInvoiceAPI.as_view(), name='LeaseOrderListForARInvoiceAPI'),
    path('deliveries/api', DeliveryListForARInvoiceAPI.as_view(), name='DeliveryListForARInvoiceAPI'),
] + [
    path('ez-invoice-detail/<str:pk>', EZInvoiceDetail.as_view(), name='EZInvoiceDetail'),
]
