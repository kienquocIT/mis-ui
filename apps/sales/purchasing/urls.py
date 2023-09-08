from django.urls import path

from apps.sales.purchasing.views import PurchaseOrderCreate, PurchaseRequestList, PurchaseRequestCreate, \
    PurchaseRequestListAPI, PurchaseRequestDetailAPI, PurchaseRequestDetail, PurchaseOrderDetailAPI, \
    PurchaseOrderDetail, PurchaseOrderListAPI, PurchaseOrderList, PurchaseQuotationRequestList, \
    PurchaseQuotationRequestListAPI, PurchaseQuotationRequestCreateFromPR, PurchaseQuotationRequestCreateManual, \
    PurchaseQuotationRequestDetail, PurchaseQuotationRequestDetailAPI, PurchaseQuotationList, PurchaseQuotationCreate, \
    PurchaseQuotationListAPI, PurchaseQuotationDetail, PurchaseQuotationDetailAPI, PurchaseRequestProductListAPI, \
    PurchaseQuotationProductListAPI, PurchaseOrderUpdate, PurchaseOrderProductListAPI, PurchaseOrderSaleListAPI,
    PurchaseRequestListForPQRAPI

urlpatterns = [
    # purchase request
    path('purchase-request/list', PurchaseRequestList.as_view(), name='PurchaseRequestList'),
    path('purchase-request/create', PurchaseRequestCreate.as_view(), name='PurchaseRequestCreate'),
    path('purchase-request/list/api', PurchaseRequestListAPI.as_view(), name='PurchaseRequestListAPI'),
    path('purchase-request/<str:pk>', PurchaseRequestDetail.as_view(), name='PurchaseRequestDetail'),
    path('purchase-request/api/<str:pk>', PurchaseRequestDetailAPI.as_view(), name='PurchaseRequestDetailAPI'),
    path(
        'purchase-request-product/list',
        PurchaseRequestProductListAPI.as_view(),
        name='PurchaseRequestProductListAPI'
    ),
    path('purchase-request/list-for-pqr/api', PurchaseRequestListForPQRAPI.as_view(), name='PurchaseRequestListForPQRAPI'),

    # purchase quotation request
    # purchase quotation
    # purchase order
    path('purchase-order/list', PurchaseOrderList.as_view(), name='PurchaseOrderList'),
    path('purchase-order/api/lists', PurchaseOrderListAPI.as_view(), name='PurchaseOrderListAPI'),
    path('purchase-order/api/lists-sale', PurchaseOrderSaleListAPI.as_view(), name='PurchaseOrderSaleListAPI'),
    path('purchase-order/create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
    path('purchase-order/detail/<str:pk>', PurchaseOrderDetail.as_view(), name='PurchaseOrderDetail'),
    path('purchase-order/detail-api/<str:pk>', PurchaseOrderDetailAPI.as_view(), name='PurchaseOrderDetailAPI'),
    path('purchase-order/update/<str:pk>', PurchaseOrderUpdate.as_view(), name='PurchaseOrderUpdate'),
    path('purchase-order-product/list', PurchaseOrderProductListAPI.as_view(), name='PurchaseOrderProductListAPI'),
] + [
    path(
        'purchase-quotation-request/lists',
        PurchaseQuotationRequestList.as_view(),
        name='PurchaseQuotationRequestList',
    ),
    path(
        'purchase-quotation-request/list/api',
        PurchaseQuotationRequestListAPI.as_view(),
        name='PurchaseQuotationRequestListAPI'
    ),
    path(
        'purchase-quotation-request/create-from-pr',
        PurchaseQuotationRequestCreateFromPR.as_view(),
        name='PurchaseQuotationRequestCreateFromPR'
    ),
    path(
        'purchase-quotation-request/create-manual',
        PurchaseQuotationRequestCreateManual.as_view(),
        name='PurchaseQuotationRequestCreateManual'
    ),
    path(
        'purchase-quotation-request/detail/<str:pk>',
        PurchaseQuotationRequestDetail.as_view(),
        name='PurchaseQuotationRequestDetail'
    ),
    path(
        'purchase-quotation-request/detail/api/<str:pk>',
        PurchaseQuotationRequestDetailAPI.as_view(),
        name='PurchaseQuotationRequestDetailAPI'
    ),
] + [
    path(
        'purchase-quotation/lists',
        PurchaseQuotationList.as_view(),
        name='PurchaseQuotationList',
    ),
    path(
        'purchase-quotation/list/api',
        PurchaseQuotationListAPI.as_view(),
        name='PurchaseQuotationListAPI'
    ),
    path(
        'purchase-quotation/create',
        PurchaseQuotationCreate.as_view(),
        name='PurchaseQuotationCreate'
    ),
    path(
        'purchase-quotation/detail/<str:pk>',
        PurchaseQuotationDetail.as_view(),
        name='PurchaseQuotationDetail'
    ),
    path(
        'purchase-quotation/detail/api/<str:pk>',
        PurchaseQuotationDetailAPI.as_view(),
        name='PurchaseQuotationDetailAPI'
    ),
    path(
        'purchase-quotation-product/list',
        PurchaseQuotationProductListAPI.as_view(),
        name='PurchaseQuotationProductListAPI'
    ),
]
