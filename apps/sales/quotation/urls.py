from django.urls import path

from apps.sales.quotation.views import QuotationCreate, QuotationList, QuotationListAPI

urlpatterns = [
    path('lists', QuotationList.as_view(), name='QuotationList'),
    path('api/lists', QuotationListAPI.as_view(), name='QuotationListAPI'),
    path('create', QuotationCreate.as_view(), name='QuotationCreate'),
]
