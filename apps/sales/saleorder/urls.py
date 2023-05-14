from django.urls import path

from apps.sales.saleorder.views import SaleOrderCreate

urlpatterns = [
    # path('lists', QuotationList.as_view(), name='QuotationList'),
    # path('api/lists', QuotationListAPI.as_view(), name='QuotationListAPI'),
    path('create', SaleOrderCreate.as_view(), name='SaleOrderCreate'),
    # path('detail/<str:pk>', QuotationDetail.as_view(), name='QuotationDetail'),
    # path('detail-api/<str:pk>', QuotationDetailAPI.as_view(), name='QuotationDetailAPI'),
]
