from django.urls import path
from apps.sales.cashoutflow.views import (
    AdvancePaymentList, AdvancePaymentCreate, AdvancePaymentListAPI, AdvancePaymentDetail, AdvancePaymentDetailAPI,
    AdvancePaymentUpdate, PaymentCostListAPI,
    ReturnAdvanceListAPI, ReturnAdvanceDetail, ReturnAdvanceCreate, ReturnAdvanceList, ReturnAdvanceDetailAPI,
    PaymentList, PaymentCreate, PaymentListAPI, PaymentDetailAPI, PaymentDetail, PaymentUpdate,
    ReturnAdvanceUpdate, PaymentConfigList, PaymentConfigListAPI, AdvancePaymentCostListAPI, APListForReturnAPI,
    AdvancePaymentPrintAPI
)
from apps.sales.cashoutflow.views.cashoutflow_common import CashOutflowQuotationListAPI, CashOutflowSaleOrderListAPI, \
    CashOutflowSupplierListAPI

urlpatterns = [
    path('quotation-list', CashOutflowQuotationListAPI.as_view(), name='CashOutflowQuotationListAPI'),
    path('sale-order-list', CashOutflowSaleOrderListAPI.as_view(), name='CashOutflowSaleOrderListAPI'),
    path('supplier-list', CashOutflowSupplierListAPI.as_view(), name='CashOutflowSupplierListAPI'),

    path('advance-payments', AdvancePaymentList.as_view(), name='AdvancePaymentList'),
    path('advance-payments/api', AdvancePaymentListAPI.as_view(), name='AdvancePaymentListAPI'),
    path('advance-payment/create', AdvancePaymentCreate.as_view(), name='AdvancePaymentCreate'),
    path('advance-payment/detail/<str:pk>', AdvancePaymentDetail.as_view(), name='AdvancePaymentDetail'),
    path('advance-payment/update/<str:pk>', AdvancePaymentUpdate.as_view(), name='AdvancePaymentUpdate'),
    path('advance-payment/api/<str:pk>', AdvancePaymentDetailAPI.as_view(), name='AdvancePaymentDetailAPI'),
    path('advance-payment-cost-list', AdvancePaymentCostListAPI.as_view(), name='AdvancePaymentCostListAPI'),
    path('advance-payment-print/api/<str:pk>', AdvancePaymentPrintAPI.as_view(), name='AdvancePaymentPrintAPI'),
] + [
    path('return-advances', ReturnAdvanceList.as_view(), name='ReturnAdvanceList'),
    path('return-advances/create', ReturnAdvanceCreate.as_view(), name='ReturnAdvanceCreate'),
    path('return-advances/api', ReturnAdvanceListAPI.as_view(), name='ReturnAdvanceListAPI'),
    path('return-advance/detail/<str:pk>', ReturnAdvanceDetail.as_view(), name='ReturnAdvanceDetail'),
    path('return-advance/api/<str:pk>', ReturnAdvanceDetailAPI.as_view(), name='ReturnAdvanceDetailAPI'),
    path('return-advance/update/<str:pk>', ReturnAdvanceUpdate.as_view(), name='ReturnAdvanceUpdate'),
    path('ap-list-for-return/api', APListForReturnAPI.as_view(), name='APListForReturnAPI'),
] + [
    path('payments', PaymentList.as_view(), name='PaymentList'),
    path('payment-config', PaymentConfigList.as_view(), name='PaymentConfigList'),
    path('payments/api', PaymentListAPI.as_view(), name='PaymentListAPI'),
    path('payment-config/api', PaymentConfigListAPI.as_view(), name='PaymentConfigListAPI'),
    path('payment/create', PaymentCreate.as_view(), name='PaymentCreate'),
    path('payment/detail/<str:pk>', PaymentDetail.as_view(), name='PaymentDetail'),
    path('payment/update/<str:pk>', PaymentUpdate.as_view(), name='PaymentUpdate'),
    path('payment/api/<str:pk>', PaymentDetailAPI.as_view(), name='PaymentDetailAPI'),
    path('payment-cost-list', PaymentCostListAPI.as_view(), name='PaymentCostListAPI'),
]