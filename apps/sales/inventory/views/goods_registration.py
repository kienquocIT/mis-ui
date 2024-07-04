from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class GoodsRegistrationList(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_registration/goods_registration_list.html',
        menu_active='menu_goods_registration',
        breadcrumb='GOODS_REGISTRATION_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsRegistrationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_LIST).get()
        return resp.auto_return(key_success='goods_registration_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.GOODS_REGISTRATION_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class GoodsRegistrationCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_registration/goods_registration_create.html',
        menu_active='menu_goods_registration',
        breadcrumb='GOODS_REGISTRATION_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {
            'data': {},
        }, status.HTTP_200_OK


class GoodsRegistrationDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_registration/goods_registration_detail.html',
        breadcrumb='GOODS_REGISTRATION_DETAIL_PAGE',
        menu_active='menu_goods_registration',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsRegistrationUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_registration/goods_registration_update.html',
        breadcrumb='GOODS_REGISTRATION_UPDATE_PAGE',
        menu_active='menu_goods_registration',
    )
    def get(self, request, *args, **kwargs):
        return {
            'data': {}
        }, status.HTTP_200_OK


class GoodsRegistrationDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='good_registration_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.GOODS_REGISTRATION_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class GoodsRegistrationProductWarehouseAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_PRD_WH).get(params)
        return resp.auto_return(key_success='good_registration_product_warehouse')


class GoodsRegistrationProductWarehouseLotAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_PRD_WH_LOT).get(params)
        return resp.auto_return(key_success='good_registration_product_warehouse_lot')


class GoodsRegistrationProductWarehouseSerialAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_PRD_WH_SN).get(params)
        return resp.auto_return(key_success='good_registration_product_warehouse_sn')
