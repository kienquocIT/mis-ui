from django.urls import path

from apps.sales.purchasing.views import PurchaseOrderCreate, PurchaseRequestList, PurchaseRequestCreate, \
    PurchaseRequestListAPI, PurchaseRequestDetailAPI, PurchaseRequestDetail
from apps.sales.purchasing.views import (
    PurchaseOrderCreate, PurchaseQuotationRequestList, PurchaseQuotationRequestCreateFromPR,
    PurchaseQuotationRequestListAPI, PurchaseQuotationRequestDetailFromPR,
    PurchaseQuotationRequestDetailFromPRAPI, PurchaseQuotationRequestCreateManual
)
from apps.sales.purchasing.views.purchase_request import PurchaseRequestList, PurchaseRequestCreate, \
    PurchaseRequestListAPI

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
        'purchase-quotation-request/detail-from-pr/<str:pk>',
        PurchaseQuotationRequestDetailFromPR.as_view(),
        name='PurchaseQuotationRequestDetailFromPR'
    ),
    path(
        'purchase-quotation-request/detail-from-pr/api/<str:pk>',
        PurchaseQuotationRequestDetailFromPRAPI.as_view(),
        name='PurchaseQuotationRequestDetailFromPRAPI'
    ),
]
