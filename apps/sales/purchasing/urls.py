from django.urls import path

from apps.sales.purchasing.views import PurchaseOrderCreate

urlpatterns = [
    # purchase request
    # purchase quotation request
    # purchase quotation
    # purchase order
    path('create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
]
