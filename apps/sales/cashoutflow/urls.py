from django.urls import path
from apps.sales.cashoutflow.views import (
    AdvancePaymentList, AdvancePaymentCreate, AdvancePaymentListAPI, AdvancePaymentDetail, AdvancePaymentDetailAPI,
    PaymentList, PaymentCreate
)

urlpatterns = [
    path('advances-payments', AdvancePaymentList.as_view(), name='AdvancePaymentList'),
    path('advances-payments/api', AdvancePaymentListAPI.as_view(), name='AdvancePaymentListAPI'),
    path('advance-payment/create', AdvancePaymentCreate.as_view(), name='AdvancePaymentCreate'),
    path('advance-payment/<str:pk>', AdvancePaymentDetail.as_view(), name='AdvancePaymentDetail'),
    path('advance-payment/api/<str:pk>', AdvancePaymentDetailAPI.as_view(), name='AdvancePaymentDetailAPI')
] + [
    path('payments', PaymentList.as_view(), name='PaymentList'),
    path('payment/create', PaymentCreate.as_view(), name='PaymentCreate'),
]
