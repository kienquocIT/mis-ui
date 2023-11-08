from django.urls import path
from apps.sales.quotation.views import (
    QuotationCreate, QuotationList, QuotationListAPI, QuotationDetail, QuotationConfigDetail,
    QuotationDetailAPI, QuotationExpenseListAPI, QuotationConfigDetailAPI,
    QuotationIndicatorListAPI, QuotationIndicatorDetailAPI, QuotationIndicatorRestoreAPI, QuotationUpdate,
    QuotationListForCashOutflowAPI, QuotationPrint
)

urlpatterns = [
    path('config', QuotationConfigDetail.as_view(), name='QuotationConfigDetail'),
    path('config/api', QuotationConfigDetailAPI.as_view(), name='QuotationConfigDetailAPI'),
    path('indicators/api', QuotationIndicatorListAPI.as_view(), name='QuotationIndicatorListAPI'),
    path('indicator-api/<str:pk>', QuotationIndicatorDetailAPI.as_view(), name='QuotationIndicatorDetailAPI'),
    path('indicator-restore-api/<str:pk>', QuotationIndicatorRestoreAPI.as_view(), name='QuotationIndicatorRestoreAPI'),

    path('lists', QuotationList.as_view(), name='QuotationList'),
    path('list-for-cashoutflow', QuotationListForCashOutflowAPI.as_view(), name='QuotationListForCashOutflowAPI'),
    path('api/lists', QuotationListAPI.as_view(), name='QuotationListAPI'),
    path('create', QuotationCreate.as_view(), name='QuotationCreate'),
    path('detail/<str:pk>', QuotationDetail.as_view(), name='QuotationDetail'),
    path('detail-api/<str:pk>', QuotationDetailAPI.as_view(), name='QuotationDetailAPI'),
    path('update/<str:pk>', QuotationUpdate.as_view(), name='QuotationUpdate'),
    path('quotation-expense-list', QuotationExpenseListAPI.as_view(), name='QuotationExpenseListAPI'),
    path('print/<str:pk>', QuotationPrint.as_view(), name='QuotationPrint'),
]
