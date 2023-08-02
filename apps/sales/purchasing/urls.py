from django.urls import path

from apps.sales.purchasing.views import PurchaseOrderCreate, PurchaseRequestList, PurchaseRequestCreate, \
    PurchaseRequestListAPI, PurchaseRequestDetailAPI, PurchaseRequestDetail, PurchaseOrderDetailAPI, \
    PurchaseOrderDetail, PurchaseOrderListAPI, PurchaseOrderList

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
    path('purchase-order/list', PurchaseOrderList.as_view(), name='PurchaseOrderList'),
    path('purchase-order/api/lists', PurchaseOrderListAPI.as_view(), name='PurchaseOrderListAPI'),
    path('purchase-order/create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
    path('purchase-order/update/<str:pk>', PurchaseOrderDetail.as_view(), name='PurchaseOrderDetail'),
    path('purchase-order/update-api/<str:pk>', PurchaseOrderDetailAPI.as_view(), name='PurchaseOrderDetailAPI'),
]
