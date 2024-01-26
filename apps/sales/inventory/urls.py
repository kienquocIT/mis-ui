from django.urls import path

from apps.sales.inventory.views import (
    GoodsReceiptList, GoodsReceiptCreate, GoodsReceiptListAPI,
    GoodsReceiptDetailAPI, GoodsReceiptDetail, GoodsReceiptUpdate,
    InventoryAdjustmentList, InventoryAdjustmentCreate, InventoryAdjustmentListAPI,
    InventoryAdjustmentListAPI, InventoryAdjustmentDetailAPI, InventoryAdjustmentDetail,
    InventoryAdjustmentOtherListAPI, GoodsIssueList, GoodsIssueCreate, GoodsIssueDetail, GoodsIssueListAPI,
    GoodsIssueDetailAPI, InventoryAdjustmentProductListAPI, GoodsIssueUpdate,
    GoodsReturnList, GoodsReturnCreate, GoodsReturnDetail, GoodsReturnUpdate, SaleOrderListAPIForGoodsReturn,
    DeliveryListForGoodsReturnAPI, DeliveryProductsForGoodsReturnAPI
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
    path(
        'inventory-adjustment/api/list-other',
        InventoryAdjustmentOtherListAPI.as_view(),
        name='InventoryAdjustmentOtherListAPI'
    ),
    path('inventory-adjustment/create', InventoryAdjustmentCreate.as_view(), name='InventoryAdjustmentCreate'),
    path('inventory-adjustment/api', InventoryAdjustmentListAPI.as_view(), name='InventoryAdjustmentListAPI'),
    path('inventory-adjustment/<str:pk>', InventoryAdjustmentDetail.as_view(), name='InventoryAdjustmentDetail'),
    path(
        'inventory-adjustment/api/<str:pk>', InventoryAdjustmentDetailAPI.as_view(), name='InventoryAdjustmentDetailAPI'
    ),
    path(
        'inventory-adjustment/product/list/api/<str:ia_id>',
        InventoryAdjustmentProductListAPI.as_view(),
        name='InventoryAdjustmentProductListAPI'
    ),
]

# goods transfer
urlpatterns += [
    path('goods-transfer/list', GoodsTransferList.as_view(), name='GoodsTransferList'),
    path('goods-transfer/create', GoodsTransferCreate.as_view(), name='GoodsTransferCreate'),
    path('goods-transfer/detail/<str:pk>', GoodsTransferDetail.as_view(), name='GoodsTransferDetail'),
    path('goods-transfer/list/api', GoodsTransferListAPI.as_view(), name='GoodsTransferListAPI'),
    path('goods-transfer/detail/api/<str:pk>', GoodsTransferDetailAPI.as_view(), name='GoodsTransferDetailAPI'),
]

# goods issue
urlpatterns += [
    path('goods-issue/list', GoodsIssueList.as_view(), name='GoodsIssueList'),
    path('goods-issue/create', GoodsIssueCreate.as_view(), name='GoodsIssueCreate'),
    path('goods-issue/detail/<str:pk>', GoodsIssueDetail.as_view(), name='GoodsIssueDetail'),
    path('goods-issue/list/api', GoodsIssueListAPI.as_view(), name='GoodsIssueListAPI'),
    path('goods-issue/detail/api/<str:pk>', GoodsIssueDetailAPI.as_view(), name='GoodsIssueDetailAPI'),
    path('goods-issue/update/<str:pk>', GoodsIssueUpdate.as_view(), name='GoodsIssueUpdate'),
]

# goods return
urlpatterns += [
    path('goods-return/list', GoodsReturnList.as_view(), name='GoodsReturnList'),
    path('goods-return/create', GoodsReturnCreate.as_view(), name='GoodsReturnCreate'),
    path('goods-return/detail/<str:pk>', GoodsReturnDetail.as_view(), name='GoodsReturnDetail'),
    # path('goods-return/list/api', GoodsReturnListAPI.as_view(), name='GoodsReturnListAPI'),
    # path('goods-return/detail/api/<str:pk>', GoodsReturnDetailAPI.as_view(), name='GoodsReturnDetailAPI'),
    path('goods-return/update/<str:pk>', GoodsReturnUpdate.as_view(), name='GoodsReturnUpdate'),
    path('sale-orders-for-goods-return/list', SaleOrderListAPIForGoodsReturn.as_view(), name='SaleOrderListAPIForGoodsReturn'),
    path('deliveries/api', DeliveryListForGoodsReturnAPI.as_view(), name='DeliveryListForGoodsReturnAPI'),
    path('delivery-products/api/<str:pk>', DeliveryProductsForGoodsReturnAPI.as_view(), name='DeliveryProductsForGoodsReturnAPI'),
]
