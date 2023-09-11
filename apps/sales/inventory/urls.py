from django.urls import path

from apps.sales.inventory.views import GoodReceiptList, GoodReceiptCreate

urlpatterns = [
    # good receipt
    path('good-receipt/list', GoodReceiptList.as_view(), name='GoodReceiptList'),
    # path('purchase-order/api/lists', PurchaseOrderListAPI.as_view(), name='PurchaseOrderListAPI'),
    path('good-receipt/create', GoodReceiptCreate.as_view(), name='GoodReceiptCreate'),
    # path('purchase-order/detail/<str:pk>', PurchaseOrderDetail.as_view(), name='PurchaseOrderDetail'),
    # path('purchase-order/detail-api/<str:pk>', PurchaseOrderDetailAPI.as_view(), name='PurchaseOrderDetailAPI'),
    # path('purchase-order/update/<str:pk>', PurchaseOrderUpdate.as_view(), name='PurchaseOrderUpdate'),
]
