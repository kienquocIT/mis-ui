from django.urls import path
from apps.sales.apinvoice.views import (
    APInvoiceList, APInvoiceCreate, APInvoiceDetail, APInvoiceUpdate,
    APInvoiceListAPI, APInvoiceDetailAPI,
    GoodReceiptsListForAPInvoiceAPI
)

urlpatterns = [
    path('ap-invoices', APInvoiceList.as_view(), name='APInvoiceList'),
    path('ap-invoices/api', APInvoiceListAPI.as_view(), name='APInvoiceListAPI'),
    path('ap-invoice/create', APInvoiceCreate.as_view(), name='APInvoiceCreate'),
    path('ap-invoice/detail/<str:pk>', APInvoiceDetail.as_view(), name='APInvoiceDetail'),
    path('ap-invoice/update/<str:pk>', APInvoiceUpdate.as_view(), name='APInvoiceUpdate'),
    path('ap-invoice/api/<str:pk>', APInvoiceDetailAPI.as_view(), name='APInvoiceDetailAPI'),
] + [
    path('goods-receipts/api', GoodReceiptsListForAPInvoiceAPI.as_view(), name='GoodReceiptsListForAPInvoiceAPI'),
]
