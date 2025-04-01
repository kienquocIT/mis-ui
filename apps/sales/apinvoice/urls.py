from django.urls import path
from apps.sales.apinvoice.views import (
    APInvoiceList, APInvoiceCreate, APInvoiceDetail, APInvoiceUpdate,
    APInvoiceListAPI, APInvoiceDetailAPI,
    GoodReceiptsListForAPInvoiceAPI
)

urlpatterns = [
    path('list', APInvoiceList.as_view(), name='APInvoiceList'),
    path('create', APInvoiceCreate.as_view(), name='APInvoiceCreate'),
    path('detail/<str:pk>', APInvoiceDetail.as_view(), name='APInvoiceDetail'),
    path('update/<str:pk>', APInvoiceUpdate.as_view(), name='APInvoiceUpdate'),
    path('list/api', APInvoiceListAPI.as_view(), name='APInvoiceListAPI'),
    path('detail/api/<str:pk>', APInvoiceDetailAPI.as_view(), name='APInvoiceDetailAPI'),
] + [
    path('goods-receipts/api', GoodReceiptsListForAPInvoiceAPI.as_view(), name='GoodReceiptsListForAPInvoiceAPI'),
]
