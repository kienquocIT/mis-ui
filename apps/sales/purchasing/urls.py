from django.urls import path
from apps.sales.purchasing.views import (
    PurchaseOrderCreate,
    PurchaseQuotationRequestList, PurchaseQuotationRequestListAPI,
    PurchaseQuotationRequestCreateFromPR, PurchaseQuotationRequestCreateManual,
    PurchaseQuotationRequestDetail, PurchaseQuotationRequestDetailAPI,
    PurchaseRequestDetailAPI, PurchaseRequestDetail, PurchaseRequestList,
    PurchaseRequestListAPI, PurchaseRequestCreate,
    PurchaseQuotationList, PurchaseQuotationCreate, PurchaseQuotationListAPI,
    PurchaseQuotationDetail, PurchaseQuotationDetailAPI
)

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
    path('purchase-order/create', PurchaseOrderCreate.as_view(), name='PurchaseOrderCreate'),
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
]
