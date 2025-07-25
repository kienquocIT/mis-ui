from django.urls import path
from apps.sales.reconciliation.views import (
    ReconList, ReconCreate, ReconDetail,
    ReconListAPI, ReconDetailAPI, ARInvoiceListForReconAPI, CashInflowListForReconAPI, ReconUpdate
)

urlpatterns = [
    # reconciliation
    path('list', ReconList.as_view(), name='ReconList'),
    path('create', ReconCreate.as_view(), name='ReconCreate'),
    path('detail/<str:pk>', ReconDetail.as_view(), name='ReconDetail'),
    path('update/<str:pk>', ReconUpdate.as_view(), name='ReconUpdate'),
    path('api/list', ReconListAPI.as_view(), name='ReconListAPI'),
    path('api/<str:pk>', ReconDetailAPI.as_view(), name='ReconDetailAPI'),
    path('ar-invoice-list-for-recon/api', ARInvoiceListForReconAPI.as_view(), name='ARInvoiceListForReconAPI'),
    path('cash-inflow-list-for-recon/api', CashInflowListForReconAPI.as_view(), name='CashInflowListForReconAPI'),
]
