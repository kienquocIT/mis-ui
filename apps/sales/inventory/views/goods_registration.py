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


class GoodsRegistrationDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_registration/goods_registration_detail.html',
        breadcrumb='GOODS_REGISTRATION_DETAIL_PAGE',
        menu_active='menu_goods_registration',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


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


# lấy dữ liệu chi tiết nhập-xuất hàng của dự án
class GReItemListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_ITEM_SUB_LIST).get(params)
        return resp.auto_return(key_success='goods_registration_item_sub_list')


# lấy hàng đăng kí theo dự án
class GReItemProductWarehouseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_PRD_WH).get(params)
        return resp.auto_return(key_success='gre_item_prd_wh_list')


class GReItemProductWarehouseLotListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_PRD_WH_LOT).get(params)
        return resp.auto_return(key_success='gre_item_prd_wh_lot_list')


class GReItemProductWarehouseSerialListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_PRD_WH_SN).get(params)
        return resp.auto_return(key_success='good_registration_serial')


# lấy hàng dự án dành cho Goods Transfer
class ProjectProductListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST_FOR_PROJECT).get(params)
        return resp.auto_return(key_success='project_product_list')


class NoneProjectProductListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST_FOR_NONE_PROJECT).get(params)
        return resp.auto_return(key_success='none_project_product_list')


# mượn hàng giữa các dự án
class GReItemBorrowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_BORROW_LIST).get(params)
        return resp.auto_return(key_success='gre_item_borrow_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_BORROW_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRE_ITEM_BORROW_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class GReItemBorrowDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_BORROW_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='gre_item_borrow_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_BORROW_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRE_ITEM_BORROW_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class GReItemAvailableQuantityAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GRE_ITEM_AVAILABLE_QUANTITY).get(params)
        return resp.auto_return(key_success='gre_item_available_quantity')


# mượn hàng từ kho chung
class NoneGReItemBorrowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.NONE_GRE_ITEM_BORROW_LIST).get(params)
        return resp.auto_return(key_success='none_gre_item_borrow_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.NONE_GRE_ITEM_BORROW_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRE_ITEM_BORROW_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class NoneGReItemBorrowDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.NONE_GRE_ITEM_BORROW_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='none_gre_item_borrow_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.NONE_GRE_ITEM_BORROW_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRE_ITEM_BORROW_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class NoneGReItemAvailableQuantityAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.NONE_GRE_ITEM_AVAILABLE_QUANTITY).get(params)
        return resp.auto_return(key_success='none_gre_item_available_quantity')


class GoodsRegisBorrowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_REGISTRATION_BORROW_LIST).get(data)
        return resp.auto_return(key_success='regis_borrow_list')
