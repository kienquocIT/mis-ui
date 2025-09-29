from django.urls import path

from apps.sales.purchasing.views import (
    PurchaseOrderCreate, PurchaseRequestList, PurchaseRequestCreate, PurchaseRequestProductListAPI,
    PurchaseOrderUpdate, PurchaseOrderProductGRListAPI, PurchaseOrderSaleListAPI,

    PurchaseRequestListAPI, PurchaseRequestDetailAPI, PurchaseRequestDetail,
    PurchaseRequestListForPQRAPI, PurchaseRequestConfigAPI, PurchaseRequestConfig, PurchaseRequestUpdate,

    PurchaseOrderDetailAPI, PurchaseOrderDetail, PurchaseOrderListAPI, PurchaseOrderList,

    PurchaseQuotationRequestList, PurchaseQuotationRequestListAPI, PurchaseQuotationRequestCreateFromPR,
    PurchaseQuotationUpdate, PurchaseQuotationRequestCreateManual, PurchaseQuotationRequestDetail,
    PurchaseQuotationRequestDetailAPI, PurchaseQuotationRequestUpdate,

    PurchaseQuotationList, PurchaseQuotationListAPI, PurchaseQuotationCreate, PurchaseQuotationDetail,
    PurchaseQuotationDetailAPI, PurchaseQuotationProductListAPI, PurchaseRequestSaleListAPI,
    PurchaseQuotationSaleListAPI, PurchaseOrderDDListAPI, SaleOrderListForPRAPI, ServiceOrderProductListForPRAPI,
    DistributionPlanProductListForPRAPI, SaleOrderProductListForPRAPI, DistributionPlanListForPRAPI,
    ServiceOrderListForPRAPI,
)

urlpatterns = [
    # purchase request
    path('purchase-request/list', PurchaseRequestList.as_view(), name='PurchaseRequestList'),
    path('purchase-request/create', PurchaseRequestCreate.as_view(), name='PurchaseRequestCreate'),
    path('purchase-request/detail/<str:pk>', PurchaseRequestDetail.as_view(), name='PurchaseRequestDetail'),
    path('purchase-request/update/<str:pk>', PurchaseRequestUpdate.as_view(), name='PurchaseRequestUpdate'),
    path('purchase-request/list/api', PurchaseRequestListAPI.as_view(), name='PurchaseRequestListAPI'),
    path('purchase-request/api/<str:pk>', PurchaseRequestDetailAPI.as_view(), name='PurchaseRequestDetailAPI'),
    # config
    path('purchase-request/config', PurchaseRequestConfig.as_view(), name='PurchaseRequestConfig'),
    path('purchase-request/config/api', PurchaseRequestConfigAPI.as_view(), name='PurchaseRequestConfigAPI'),
    # related
    path('pr-so-list/api', SaleOrderListForPRAPI.as_view(), name='SaleOrderListForPRAPI'),
    path('pr-so-product-list/api/<str:pk>', SaleOrderProductListForPRAPI.as_view(), name='SaleOrderProductListForPRAPI'),
    path('pr-dp-list/api', DistributionPlanListForPRAPI.as_view(), name='DistributionPlanListForPRAPI'),
    path('pr-dp-product-list/api/<str:pk>', DistributionPlanProductListForPRAPI.as_view(), name='DistributionPlanProductListForPRAPI'),
    path('pr-svo-list/api', ServiceOrderListForPRAPI.as_view(), name='ServiceOrderListForPRAPI'),
    path('pr-svo-product-list/api/<str:pk>', ServiceOrderProductListForPRAPI.as_view(), name='ServiceOrderProductListForPRAPI'),
    path('pr-product-list', PurchaseRequestProductListAPI.as_view(), name='PurchaseRequestProductListAPI'),
] + [
    # purchase order
    path('purchase-order/list', PurchaseOrderList.as_view(), name='PurchaseOrderList'),
    path('purchase-order/api/lists', PurchaseOrderListAPI.as_view(), name='PurchaseOrderListAPI'),
    path('purchase-order/create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
    path('purchase-order/detail/<str:pk>', PurchaseOrderDetail.as_view(), name='PurchaseOrderDetail'),
    path('purchase-order/detail-api/<str:pk>', PurchaseOrderDetailAPI.as_view(), name='PurchaseOrderDetailAPI'),
    path('purchase-order/update/<str:pk>', PurchaseOrderUpdate.as_view(), name='PurchaseOrderUpdate'),
    # related
    path('purchase-order/api/lists-sale', PurchaseOrderSaleListAPI.as_view(), name='PurchaseOrderSaleListAPI'),
    path('purchase-order-product-gr/list', PurchaseOrderProductGRListAPI.as_view(), name='PurchaseOrderProductGRListAPI'),
    path('purchase-order-dropdown/api/list', PurchaseOrderDDListAPI.as_view(), name='PurchaseOrderDDListAPI'),
    path('purchase-request/list-sale/api', PurchaseRequestSaleListAPI.as_view(), name='PurchaseRequestSaleListAPI'),
] + [
    # purchase quotation request
    path('purchase-quotation-request/lists', PurchaseQuotationRequestList.as_view(), name='PurchaseQuotationRequestList'),
    path('purchase-quotation-request/detail/<str:pk>', PurchaseQuotationRequestDetail.as_view(), name='PurchaseQuotationRequestDetail'),
    path('purchase-quotation-request/create-from-pr', PurchaseQuotationRequestCreateFromPR.as_view(), name='PurchaseQuotationRequestCreateFromPR'),
    path('purchase-quotation-request/create-manual', PurchaseQuotationRequestCreateManual.as_view(), name='PurchaseQuotationRequestCreateManual'),
    path('purchase-quotation-request/update/<str:pk>', PurchaseQuotationRequestUpdate.as_view(), name='PurchaseQuotationRequestUpdate'),
    path('purchase-quotation-request/list/api', PurchaseQuotationRequestListAPI.as_view(), name='PurchaseQuotationRequestListAPI'),
    path('purchase-quotation-request/api/<str:pk>', PurchaseQuotationRequestDetailAPI.as_view(), name='PurchaseQuotationRequestDetailAPI'),
    # related
    path('purchase-request/list-for-pqr/api', PurchaseRequestListForPQRAPI.as_view(), name='PurchaseRequestListForPQRAPI'),
] + [
    # purchase quotation
    path('purchase-quotation/lists', PurchaseQuotationList.as_view(), name='PurchaseQuotationList'),
    path('purchase-quotation/detail/<str:pk>', PurchaseQuotationDetail.as_view(), name='PurchaseQuotationDetail'),
    path('purchase-quotation/create', PurchaseQuotationCreate.as_view(), name='PurchaseQuotationCreate'),
    path('purchase-quotation/update/<str:pk>', PurchaseQuotationUpdate.as_view(), name='PurchaseQuotationUpdate'),
    path('purchase-quotation/list/api', PurchaseQuotationListAPI.as_view(), name='PurchaseQuotationListAPI'),
    path('purchase-quotation/api/<str:pk>', PurchaseQuotationDetailAPI.as_view(), name='PurchaseQuotationDetailAPI'),
    path('purchase-quotation-product/list', PurchaseQuotationProductListAPI.as_view(), name='PurchaseQuotationProductListAPI'),
    path('purchase-quotation/list-sale/api', PurchaseQuotationSaleListAPI.as_view(), name='PurchaseQuotationSaleListAPI'),
]
