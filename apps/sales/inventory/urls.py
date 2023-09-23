from django.urls import path

from apps.sales.inventory.views import (
    GoodsReceiptList, GoodsReceiptCreate, GoodsReceiptListAPI,
    GoodsReceiptDetailAPI, GoodsReceiptDetail, GoodsReceiptUpdate,
    InventoryAdjustmentList, InventoryAdjustmentCreate, InventoryAdjustmentListAPI,
    InventoryAdjustmentListAPI, InventoryAdjustmentDetailAPI, InventoryAdjustmentDetail
)
from apps.sales.inventory.views.goods_transfer import GoodsTransferList, GoodsTransferDetail, GoodsTransferCreate, \
    GoodsTransferListAPI, GoodsTransferDetailAPI

urlpatterns = [
    # good receipt
    path('goods-receipt/list', GoodsReceiptList.as_view(), name='GoodsReceiptList'),
    path('goods-receipt/api/list', GoodsReceiptListAPI.as_view(), name='GoodsReceiptListAPI'),
    path('goods-receipt/create', GoodsReceiptCreate.as_view(), name='GoodsReceiptCreate'),
    path('goods-receipt/detail/<str:pk>', GoodsReceiptDetail.as_view(), name='GoodsReceiptDetail'),
    path('goods-receipt/detail-api/<str:pk>', GoodsReceiptDetailAPI.as_view(), name='GoodsReceiptDetailAPI'),
    path('goods-receipt/update/<str:pk>', GoodsReceiptUpdate.as_view(), name='GoodsReceiptUpdate'),
    # inventory adjustment
    path('inventory-adjustment/list', InventoryAdjustmentList.as_view(), name='InventoryAdjustmentList'),
    path('inventory-adjustment/api/list', InventoryAdjustmentListAPI.as_view(), name='InventoryAdjustmentListAPI'),
    path('inventory-adjustment/create', InventoryAdjustmentCreate.as_view(), name='InventoryAdjustmentCreate'),
    path('inventory-adjustment/api', InventoryAdjustmentListAPI.as_view(), name='InventoryAdjustmentListAPI'),
    path('inventory-adjustment/<str:pk>', InventoryAdjustmentDetail.as_view(), name='InventoryAdjustmentDetail'),
    path('inventory-adjustment/api/<str:pk>', InventoryAdjustmentDetailAPI.as_view(), name='InventoryAdjustmentDetailAPI'),
]

# goods transfer
urlpatterns += [
    path('goods-transfer/list', GoodsTransferList.as_view(), name='GoodsTransferList'),
    path('goods-transfer/create', GoodsTransferCreate.as_view(), name='GoodsTransferCreate'),
    path('goods-transfer/detail/<str:pk>', GoodsTransferDetail.as_view(), name='GoodsTransferDetail'),
    path('goods-transfer/list/api', GoodsTransferListAPI.as_view(), name='GoodsTransferListAPI'),
    path('goods-transfer/detail/api/<str:pk>', GoodsTransferDetailAPI.as_view(), name='GoodsTransferDetailAPI'),
]
