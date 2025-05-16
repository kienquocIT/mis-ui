from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties, PermCheck
from apps.shared.msg import PurchasingMsg
from apps.shared.constant import SYSTEM_STATUS

PO_GR_STATUS = (
    (0, PurchasingMsg.PO_GR_NONE),
    (1, PurchasingMsg.PO_GR_WAIT),
    (2, PurchasingMsg.PO_GR_PART),
    (3, PurchasingMsg.PO_GR_RECEIVED),
)


def create_purchase_order(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_purchase_order(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class PurchaseOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchaseorder/purchase_order_list.html',
        menu_active='menu_purchase_order_list',
        breadcrumb='PURCHASE_ORDER_LIST_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS, 'gr_status': PO_GR_STATUS}, status.HTTP_200_OK


class PurchaseOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchaseorder/purchase_order_create.html',
        menu_active='menu_purchase_order_list',
        breadcrumb='PURCHASE_ORDER_CREATE_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseOrderListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_ORDER_LIST).get(data)
        return resp.auto_return(key_success='purchase_order_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_purchase_order(
            request=request,
            url=ApiURL.PURCHASE_ORDER_LIST,
            msg=SaleMsg.PURCHASE_ORDER_CREATE
        )


class PurchaseOrderDDListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_ORDER_DROPDOWN_LIST).get(params)
        return resp.auto_return(key_success='purchase_order_dd_list')


class PurchaseOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchaseorder/purchase_order_detail.html',
        menu_active='menu_purchase_order_list',
        breadcrumb='PURCHASE_ORDER_DETAIL_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
        perm_check=PermCheck(url=ApiURL.PURCHASE_ORDER_DETAIL_PK, method='GET', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class PurchaseOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchaseorder/purchase_order_update.html',
        menu_active='menu_purchase_order_list',
        breadcrumb='PURCHASE_ORDER_UPDATE_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
        perm_check=PermCheck(url=ApiURL.PURCHASE_ORDER_DETAIL_PK, method='PUT', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.PURCHASING_PURCHASE_ORDER
        return {
                   'data': {'doc_id': pk},
                   'input_mapping_properties': input_mapping_properties, 'form_id': 'frm_purchase_order_create'
               }, status.HTTP_200_OK


class PurchaseOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_ORDER_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_purchase_order(
            request=request,
            url=ApiURL.PURCHASE_ORDER_DETAIL,
            pk=pk,
            msg=SaleMsg.PURCHASE_ORDER_UPDATE
        )


class PurchaseOrderProductGRListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_ORDER_PRODUCT_GR_LIST).get(data)
        return resp.auto_return(key_success='purchase_order_product_gr')


class PurchaseOrderSaleListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_ORDER_SALE_LIST).get(data)
        return resp.auto_return(key_success='purchase_order_sale_list')
