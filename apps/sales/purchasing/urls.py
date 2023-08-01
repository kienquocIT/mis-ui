from django.urls import path

from apps.sales.purchasing.views import PurchaseOrderCreate, PurchaseRequestList, PurchaseRequestCreate, \
    PurchaseRequestListAPI

urlpatterns = [
    # purchase request
    path('purchase-request/list', PurchaseRequestList.as_view(), name='PurchaseRequestList'),
    path('purchase-request/create', PurchaseRequestCreate.as_view(), name='PurchaseRequestCreate'),
    path('purchase-request/list/api', PurchaseRequestListAPI.as_view(), name='PurchaseRequestListAPI'),

    # purchase quotation request
    # purchase quotation
    # purchase order
    path('create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
]
