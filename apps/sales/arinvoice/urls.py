from django.urls import path
from apps.sales.arinvoice.views import (
    ARInvoiceList, ARInvoiceCreate, ARInvoiceDetail, ARInvoiceUpdate,
    ARInvoiceListAPI, ARInvoiceDetailAPI,
    DeliveryListForARInvoiceAPI
)

urlpatterns = [
    path('ar-invoices', ARInvoiceList.as_view(), name='ARInvoiceList'),
    path('ar-invoices/api', ARInvoiceListAPI.as_view(), name='ARInvoiceListAPI'),
    path('ar-invoice/create', ARInvoiceCreate.as_view(), name='ARInvoiceCreate'),
    path('ar-invoice/detail/<str:pk>', ARInvoiceDetail.as_view(), name='ARInvoiceDetail'),
    path('ar-invoice/update/<str:pk>', ARInvoiceUpdate.as_view(), name='ARInvoiceUpdate'),
    path('ar-invoice/api/<str:pk>', ARInvoiceDetailAPI.as_view(), name='ARInvoiceDetailAPI'),
] + [
    path('deliveries/api', DeliveryListForARInvoiceAPI.as_view(), name='DeliveryListForARInvoiceAPI'),
]
