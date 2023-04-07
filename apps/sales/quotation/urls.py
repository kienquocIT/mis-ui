from django.urls import path

from apps.sales.quotation.views import QuotationCreate

urlpatterns = [
    path('create', QuotationCreate.as_view(), name='QuotationCreate'),
]
