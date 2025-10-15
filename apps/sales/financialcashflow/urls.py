from django.urls import path
from apps.sales.financialcashflow.views import (
    CashInflowList, CashInflowCreate, CashInflowDetail, CashInflowUpdate,
    CashInflowListAPI, CashInflowDetailAPI, ARInvoiceListForCashInflowAPI,
    CashOutflowList, CashOutflowCreate, CashOutflowDetail, CashOutflowUpdate,
    CashOutflowListAPI, CashOutflowDetailAPI, CustomerAdvanceListForCashInflowAPI,
    POPaymentStageListForCOFAPI, APInvoicePOPaymentStageListForCOFAPI
)

urlpatterns = [
    # cash inflow
    path('cashinflow/list', CashInflowList.as_view(), name='CashInflowList'),
    path('cashinflow/create', CashInflowCreate.as_view(), name='CashInflowCreate'),
    path('cashinflow/detail/<str:pk>', CashInflowDetail.as_view(), name='CashInflowDetail'),
    path('cashinflow/update/<str:pk>', CashInflowUpdate.as_view(), name='CashInflowUpdate'),
    path('cashinflow/api/list', CashInflowListAPI.as_view(), name='CashInflowListAPI'),
    path('cashinflow/api/<str:pk>', CashInflowDetailAPI.as_view(), name='CashInflowDetailAPI'),
    path('customer-advance-list-for-cashinflow/api', CustomerAdvanceListForCashInflowAPI.as_view(), name='CustomerAdvanceListForCashInflowAPI'),
    path('ar-invoice-list-for-cashinflow/api', ARInvoiceListForCashInflowAPI.as_view(), name='ARInvoiceListForCashInflowAPI')
] + [
    # cash outflow
    path('cashoutflow/list', CashOutflowList.as_view(), name='CashOutflowList'),
    path('cashoutflow/create', CashOutflowCreate.as_view(), name='CashOutflowCreate'),
    path('cashoutflow/detail/<str:pk>', CashOutflowDetail.as_view(), name='CashOutflowDetail'),
    path('cashoutflow/update/<str:pk>', CashOutflowUpdate.as_view(), name='CashOutflowUpdate'),
    path('cashoutflow/api/list', CashOutflowListAPI.as_view(), name='CashOutflowListAPI'),
    path('cashoutflow/api/<str:pk>', CashOutflowDetailAPI.as_view(), name='CashOutflowDetailAPI'),
    path('po-payment-stage-list-for-cof/api', POPaymentStageListForCOFAPI.as_view(), name='POPaymentStageListForCOFAPI'),
    path('ap-invoice-po-payment-stage-list-for-cof/api', APInvoicePOPaymentStageListForCOFAPI.as_view(), name='APInvoicePOPaymentStageListForCOFAPI'),
]
