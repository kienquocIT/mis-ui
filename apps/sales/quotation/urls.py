from django.urls import path

from apps.sales.quotation.views import (
    QuotationCreate, QuotationList, QuotationListAPI, QuotationDetail,
    QuotationDetailAPI, QuotationExpenseListAPI, QuotationConfigDetailAPI, PaymentCostItemsListAPI
)

urlpatterns = [
    path('config/api', QuotationConfigDetailAPI.as_view(), name='QuotationConfigDetailAPI'),

    path('lists', QuotationList.as_view(), name='QuotationList'),
    path('api/lists', QuotationListAPI.as_view(), name='QuotationListAPI'),
    path('create', QuotationCreate.as_view(), name='QuotationCreate'),
    path('detail/<str:pk>', QuotationDetail.as_view(), name='QuotationDetail'),
    path('detail-api/<str:pk>', QuotationDetailAPI.as_view(), name='QuotationDetailAPI'),
    path('quotation-expense-list', QuotationExpenseListAPI.as_view(), name='QuotationExpenseListAPI'),
    path('payment-cost-items-list', PaymentCostItemsListAPI.as_view(), name='PaymentCostItemsListAPI'),
]
