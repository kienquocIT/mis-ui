from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg


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
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchaseorder/purchase_order_create.html',
        menu_active='',
        breadcrumb='',
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


class PurchaseOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchaseorder/purchase_order_detail.html',
        menu_active='menu_purchase_order_list',
        breadcrumb='PURCHASE_ORDER_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


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
