from django.urls import path

from apps.sales.quotation.views import QuotationCreate, QuotationList, QuotationListAPI, QuotationDetail, \
    QuotationDetailAPI

urlpatterns = [
    path('lists', QuotationList.as_view(), name='QuotationList'),
    path('api/lists', QuotationListAPI.as_view(), name='QuotationListAPI'),
    path('create', QuotationCreate.as_view(), name='QuotationCreate'),
    path('detail/<str:pk>', QuotationDetail.as_view(), name='QuotationDetail'),
    path('detail-api/<str:pk>', QuotationDetailAPI.as_view(), name='QuotationDetailAPI'),
]
