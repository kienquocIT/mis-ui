from django.urls import path

from apps.sales.inventory.views import (
    GoodsReceiptList, GoodsReceiptCreate, GoodsReceiptListAPI,
    GoodsReceiptDetailAPI, GoodsReceiptDetail, GoodsReceiptUpdate,
    InventoryAdjustmentList, InventoryAdjustmentCreate,
    InventoryAdjustmentUpdate, InventoryAdjustmentListAPI,
    InventoryAdjustmentDetailAPI, InventoryAdjustmentDetail,
    InventoryAdjustmentGRListAPI, GoodsIssueList, GoodsIssueCreate, GoodsIssueDetail, GoodsIssueListAPI,
    GoodsIssueDetailAPI, InventoryAdjustmentProductListAPI, GoodsIssueUpdate,
    GoodsReturnList, GoodsReturnCreate, GoodsReturnDetail, GoodsReturnUpdate, SaleOrderListAPIForGoodsReturn,
    DeliveryListForGoodsReturnAPI, GoodsReturnListAPI, GoodsReturnDetailAPI,
    GoodsDetail, GoodsDetailAPI,
    GoodsTransferList, GoodsTransferDetail, GoodsTransferCreate,
    GoodsTransferListAPI, GoodsTransferDetailAPI, GoodsTransferUpdate,
    GoodsRegistrationList,
    GoodsRegistrationDetail, GoodsRegistrationDetailAPI, GoodsRegistrationListAPI,
    GReItemProductWarehouseListAPI,
    GReItemProductWarehouseLotListAPI,
    GReItemProductWarehouseSerialListAPI, ProjectProductListAPI, NoneProjectProductListAPI,
    GReItemBorrowListAPI,
    GReItemBorrowDetailAPI,
    GReItemListAPI, GReItemAvailableQuantityAPI, GoodsRegisBorrowListAPI, NoneGReItemBorrowListAPI,
    NoneGReItemBorrowDetailAPI, NoneGReItemAvailableQuantityAPI, ProductionOrderListAPIForGIS,
    ProductionOrderDetailAPIForGIS, InventoryAdjustmentListAPIForGIS, InventoryAdjustmentDetailAPIForGIS,
    ProductWarehouseSerialListAPIForGIS, ProductWarehouseLotListAPIForGIS, ProductWarehouseListAPIForGIS,
    WorkOrderListAPIForGIS, WorkOrderDetailAPIForGIS, GoodsIssueProductListAPI,
    GoodsDetailListImportDBAPI, GoodsDetailSerialDataAPI
)

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
    path('inventory-adjustment/create', InventoryAdjustmentCreate.as_view(), name='InventoryAdjustmentCreate'),
    path('inventory-adjustment/detail/<str:pk>', InventoryAdjustmentDetail.as_view(), name='InventoryAdjustmentDetail'),
    path('inventory-adjustment/update/<str:pk>', InventoryAdjustmentUpdate.as_view(), name='InventoryAdjustmentUpdate'),
    path('inventory-adjustment/api/list', InventoryAdjustmentListAPI.as_view(), name='InventoryAdjustmentListAPI'),
    path('inventory-adjustment/api/list-gr', InventoryAdjustmentGRListAPI.as_view(),
         name='InventoryAdjustmentGRListAPI'),
    path('inventory-adjustment/api', InventoryAdjustmentListAPI.as_view(), name='InventoryAdjustmentListAPI'),
    path('inventory-adjustment/api/<str:pk>', InventoryAdjustmentDetailAPI.as_view(),
         name='InventoryAdjustmentDetailAPI'),
    path('inventory-adjustment/product/list/api/<str:ia_id>', InventoryAdjustmentProductListAPI.as_view(),
         name='InventoryAdjustmentProductListAPI'),
]

# goods transfer
urlpatterns += [
    path('goods-transfer/list', GoodsTransferList.as_view(), name='GoodsTransferList'),
    path('goods-transfer/create', GoodsTransferCreate.as_view(), name='GoodsTransferCreate'),
    path('goods-transfer/detail/<str:pk>', GoodsTransferDetail.as_view(), name='GoodsTransferDetail'),
    path('goods-transfer/update/<str:pk>', GoodsTransferUpdate.as_view(), name='GoodsTransferUpdate'),
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
    # related url
    path(
        'inventory-adjustment-for-gis/list/api',
        InventoryAdjustmentListAPIForGIS.as_view(),
        name='InventoryAdjustmentListAPIForGIS'
    ),
    path(
        'inventory-adjustment-for-gis/detail/api/<str:pk>',
        InventoryAdjustmentDetailAPIForGIS.as_view(),
        name='InventoryAdjustmentDetailAPIForGIS'
    ),
    path(
        'production-order-for-gis/list/api',
        ProductionOrderListAPIForGIS.as_view(),
        name='ProductionOrderListAPIForGIS'
    ),
    path(
        'production-order-for-gis/detail/api/<str:pk>',
        ProductionOrderDetailAPIForGIS.as_view(),
        name='ProductionOrderDetailAPIForGIS'
    ),
    path(
        'work-order-for-gis/list/api',
        WorkOrderListAPIForGIS.as_view(),
        name='WorkOrderListAPIForGIS'
    ),
    path(
        'work-order-for-gis/detail/api/<str:pk>',
        WorkOrderDetailAPIForGIS.as_view(),
        name='WorkOrderDetailAPIForGIS'
    ),
    path(
        'prd-wh-list-for-gis/list/api',
        ProductWarehouseListAPIForGIS.as_view(),
        name='ProductWarehouseListAPIForGIS'
    ),
    path(
        'lot-list-for-gis/list/api',
        ProductWarehouseLotListAPIForGIS.as_view(),
        name='ProductWarehouseLotListAPIForGIS'
    ),
    path(
        'serial-list-for-gis/list/api',
        ProductWarehouseSerialListAPIForGIS.as_view(),
        name='ProductWarehouseSerialListAPIForGIS'
    ),
    path('goods-issue-product/api/list', GoodsIssueProductListAPI.as_view(), name='GoodsIssueProductListAPI'),
]

# goods return
urlpatterns += [
    path('goods-return/list', GoodsReturnList.as_view(), name='GoodsReturnList'),
    path('goods-return/create', GoodsReturnCreate.as_view(), name='GoodsReturnCreate'),
    path('goods-return/detail/<str:pk>', GoodsReturnDetail.as_view(), name='GoodsReturnDetail'),
    path('goods-return/update/<str:pk>', GoodsReturnUpdate.as_view(), name='GoodsReturnUpdate'),
    path('goods-return/list/api', GoodsReturnListAPI.as_view(), name='GoodsReturnListAPI'),
    path('goods-return/detail/api/<str:pk>', GoodsReturnDetailAPI.as_view(), name='GoodsReturnDetailAPI'),
    path('sale-orders-for-goods-return/list', SaleOrderListAPIForGoodsReturn.as_view(),
         name='SaleOrderListAPIForGoodsReturn'),
    path('deliveries/api', DeliveryListForGoodsReturnAPI.as_view(), name='DeliveryListForGoodsReturnAPI'),
]

# goods detail
urlpatterns += [
    path('goods-detail', GoodsDetail.as_view(), name='GoodsDetail'),
    path('goods-detail-sn-data/api', GoodsDetailSerialDataAPI.as_view(), name='GoodsDetailSerialDataAPI'),
    path('goods-detail/api', GoodsDetailAPI.as_view(), name='GoodsDetailAPI'),
    path('goods-detail-import-db/api', GoodsDetailListImportDBAPI.as_view(), name='GoodsDetailListImportDBAPI')
]

# goods registration
urlpatterns += [
    path('goods-registration/list', GoodsRegistrationList.as_view(), name='GoodsRegistrationList'),
    path('goods-registration/detail/<str:pk>', GoodsRegistrationDetail.as_view(), name='GoodsRegistrationDetail'),
    path('goods-registration/list/api', GoodsRegistrationListAPI.as_view(), name='GoodsRegistrationListAPI'),
    path('goods-registration/detail/api/<str:pk>', GoodsRegistrationDetailAPI.as_view(),
         name='GoodsRegistrationDetailAPI'),

    path('gre-item-sub/list/api', GReItemListAPI.as_view(),
         name='GReItemListAPI'),
    path('gre-item-prd-wh/list/api', GReItemProductWarehouseListAPI.as_view(),
         name='GReItemProductWarehouseListAPI'),
    path('gre-item-prd-wh-lot/list/api', GReItemProductWarehouseLotListAPI.as_view(), name='GReItemProductWarehouseLotListAPI'),
    path('gre-item-prd-wh-serial/list/api', GReItemProductWarehouseSerialListAPI.as_view(),
         name='GReItemProductWarehouseSerialListAPI'),
    path('product-list-for-project/list/api', ProjectProductListAPI.as_view(), name='ProjectProductListAPI'),
    path('product-list-for-none-project/list/api', NoneProjectProductListAPI.as_view(),
         name='NoneProjectProductListAPI'),

    path('gre-item-borrow/list/api', GReItemBorrowListAPI.as_view(),
         name='GReItemBorrowListAPI'),
    path('gre-item-borrow/detail/api/<str:pk>', GReItemBorrowDetailAPI.as_view(),
         name='GReItemBorrowDetailAPI'),
    path('gre-item-available-quantity/list/api', GReItemAvailableQuantityAPI.as_view(),
         name='GReItemAvailableQuantityAPI'),
    path('none-gre-item-borrow/list/api', NoneGReItemBorrowListAPI.as_view(),
         name='NoneGReItemBorrowListAPI'),
    path('none-gre-item-borrow/detail/api/<str:pk>', NoneGReItemBorrowDetailAPI.as_view(),
         name='NoneGReItemBorrowDetailAPI'),
    path('none-gre-item-available-quantity/list/api', NoneGReItemAvailableQuantityAPI.as_view(),
         name='NoneGReItemAvailableQuantityAPI'),
    path('goods-regis-borrow/api/list', GoodsRegisBorrowListAPI.as_view(), name='GoodsRegisBorrowListAPI'),
]
