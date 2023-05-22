from django.urls import path
from apps.sales.cashoutflow.views import (
    AdvancePaymentList, AdvancePaymentCreate, AdvancePaymentListAPI
    # AdvanceListAPI, , AdvanceDetail, AdvanceDetailAPI
)

urlpatterns = [
    path('advances-payments', AdvancePaymentList.as_view(), name='AdvancePaymentList'),
    path('advances-payments/api', AdvancePaymentListAPI.as_view(), name='AdvancePaymentListAPI'),
    path('advance-payment/create', AdvancePaymentCreate.as_view(), name='AdvancePaymentCreate'),
    # path('product/<str:pk>', AdvanceDetail.as_view(), name='AdvanceDetail'),
    # path('product/api/<str:pk>', AdvanceDetailAPI.as_view(), name='AdvanceDetailAPI')
]
