from django.urls import path

from apps.sales.purchasing.views import PurchaseOrderCreate, PurchaseRequestList, PurchaseRequestCreate, \
    PurchaseRequestListAPI, PurchaseRequestDetailAPI, PurchaseRequestDetail

urlpatterns = [
    # purchase request
    path('purchase-request/list', PurchaseRequestList.as_view(), name='PurchaseRequestList'),
    path('purchase-request/create', PurchaseRequestCreate.as_view(), name='PurchaseRequestCreate'),
    path('purchase-request/list/api', PurchaseRequestListAPI.as_view(), name='PurchaseRequestListAPI'),
    path('purchase-request/<str:pk>', PurchaseRequestDetail.as_view(), name='PurchaseRequestDetail'),
    path('purchase-request/api/<str:pk>', PurchaseRequestDetailAPI.as_view(), name='PurchaseRequestDetailAPI'),

    # purchase quotation request
    # purchase quotation
    # purchase order
    path('create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
]
