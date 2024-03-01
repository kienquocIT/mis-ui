from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class GoodsReturnList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_return/goods_return_list.html',
        menu_active='menu_goods_return',
        breadcrumb='GOODS_RETURN_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsReturnListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_LIST).get()
        return resp.auto_return(key_success='goods_return_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRT_INVOICE_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class GoodsReturnCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_return/goods_return_create.html',
        menu_active='menu_goods_return',
        breadcrumb='GOODS_RETURN_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST).get()
        return {
            'data': {'warehouse_list': resp1.result},
        }, status.HTTP_200_OK


class GoodsReturnDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_return/goods_return_detail.html',
        breadcrumb='GOODS_RETURN_DETAIL_PAGE',
        menu_active='menu_goods_return',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsReturnUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_return/goods_return_detail.html',
        breadcrumb='GOODS_RETURN_UPDATE_PAGE',
        menu_active='menu_goods_return',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsReturnDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='good_return_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRT_INVOICE_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class SaleOrderListAPIForGoodsReturn(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST_FOR_GOODS_RETURN).get(params)
        return resp.auto_return(key_success='sale_order_list')


class DeliveryListForGoodsReturnAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LIST_FOR_GOODS_RETURN).get(params)
        return resp.auto_return(key_success='delivery_list')


class DeliveryProductsForGoodsReturnAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PRODUCTS_FOR_GOODS_RETURN.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='delivery_products_list')
