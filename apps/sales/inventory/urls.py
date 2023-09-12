from django.urls import path

from apps.sales.inventory.views import GoodsReceiptList, GoodsReceiptCreate

urlpatterns = [
    # good receipt
    path('goods-receipt/list', GoodsReceiptList.as_view(), name='GoodsReceiptList'),
    # path('purchase-order/api/lists', PurchaseOrderListAPI.as_view(), name='PurchaseOrderListAPI'),
    path('goods-receipt/create', GoodsReceiptCreate.as_view(), name='GoodsReceiptCreate'),
    # path('purchase-order/detail/<str:pk>', PurchaseOrderDetail.as_view(), name='PurchaseOrderDetail'),
    # path('purchase-order/detail-api/<str:pk>', PurchaseOrderDetailAPI.as_view(), name='PurchaseOrderDetailAPI'),
    # path('purchase-order/update/<str:pk>', PurchaseOrderUpdate.as_view(), name='PurchaseOrderUpdate'),
]
