from django.urls import path
from apps.sales.cashoutflow.views import (
    AdvancePaymentList, AdvancePaymentCreate, AdvancePaymentListAPI, AdvancePaymentDetail, AdvancePaymentDetailAPI,
    AdvancePaymentUpdate,
    ReturnAdvanceListAPI, ReturnAdvanceDetail, ReturnAdvanceCreate, ReturnAdvanceList, ReturnAdvanceDetailAPI,
    PaymentList, PaymentCreate, PaymentListAPI, PaymentDetailAPI, PaymentDetail, PaymentCostItemsListAPI,
    ReturnAdvanceUpdate, PaymentConfigList, PaymentConfigListAPI, AdvancePaymentCostListAPI
)

urlpatterns = [
    path('advances-payments', AdvancePaymentList.as_view(), name='AdvancePaymentList'),
    path('advances-payments/api', AdvancePaymentListAPI.as_view(), name='AdvancePaymentListAPI'),
    path('advance-payment/create', AdvancePaymentCreate.as_view(), name='AdvancePaymentCreate'),
    path('advance-payment/detail/<str:pk>', AdvancePaymentDetail.as_view(), name='AdvancePaymentDetail'),
    path('advance-payment/update/<str:pk>', AdvancePaymentUpdate.as_view(), name='AdvancePaymentUpdate'),
    path('advance-payment/api/<str:pk>', AdvancePaymentDetailAPI.as_view(), name='AdvancePaymentDetailAPI'),
    path('advances-payments-cost-list', AdvancePaymentCostListAPI.as_view(), name='AdvancePaymentCostListAPI'),
] + [
    path('return-advances', ReturnAdvanceList.as_view(), name='ReturnAdvanceList'),
    path('return-advances/create', ReturnAdvanceCreate.as_view(), name='ReturnAdvanceCreate'),
    path('return-advances/api', ReturnAdvanceListAPI.as_view(), name='ReturnAdvanceListAPI'),
    path('return-advance/detail/<str:pk>', ReturnAdvanceDetail.as_view(), name='ReturnAdvanceDetail'),
    path('return-advance/api/<str:pk>', ReturnAdvanceDetailAPI.as_view(), name='ReturnAdvanceDetailAPI'),
    path('return-advance/update/<str:pk>', ReturnAdvanceUpdate.as_view(), name='ReturnAdvanceUpdate'),
] + [
    path('payments', PaymentList.as_view(), name='PaymentList'),
    path('payment-config', PaymentConfigList.as_view(), name='PaymentConfigList'),
    path('payments/api', PaymentListAPI.as_view(), name='PaymentListAPI'),
    path('payment-config/api', PaymentConfigListAPI.as_view(), name='PaymentConfigListAPI'),
    path('payment/create', PaymentCreate.as_view(), name='PaymentCreate'),
    path('payment/detail/<str:pk>', PaymentDetail.as_view(), name='PaymentDetail'),
    path('payment/api/<str:pk>', PaymentDetailAPI.as_view(), name='PaymentDetailAPI'),
    path('payment-cost-items-list', PaymentCostItemsListAPI.as_view(), name='PaymentCostItemsListAPI'),
]