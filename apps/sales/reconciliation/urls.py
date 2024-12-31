from django.urls import path
from apps.sales.reconciliation.views import (
    ReconList, ReconCreate, ReconDetail,
    ReconListAPI, ReconDetailAPI, ARInvoiceListForReconAPI
)

urlpatterns = [
    # reconciliation
    path('list', ReconList.as_view(), name='ReconList'),
    path('create', ReconCreate.as_view(), name='ReconCreate'),
    path('detail/<str:pk>', ReconDetail.as_view(), name='ReconDetail'),
    path('api/list', ReconListAPI.as_view(), name='ReconListAPI'),
    path('api/<str:pk>', ReconDetailAPI.as_view(), name='ReconDetailAPI'),
    path('ar-invoice-list-for-recon/api', ARInvoiceListForReconAPI.as_view(), name='ARInvoiceListForReconAPI'),
]
