from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck, InputMappingProperties, SaleMsg


class GoodsTransferList(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/list.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_LIST_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsTransferCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/create.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_CREATE_PAGE'
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(
            request=request,
            user=request.user,
            url=ApiURL.COMPANY_DETAIL + '/' + request.user.company_current_data.get('id', None)
        ).get()
        return {
            'is_project': resp.result['config_inventory_management'].get('cost_per_project')
        }, status.HTTP_200_OK


class GoodsTransferDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/detail.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_DETAIL_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsTransferUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/update.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_UPDATE_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.INVENTORY_GOODS_TRANSFER
        return {
            'input_mapping_properties': input_mapping_properties, 'form_id': 'frm_goods_transfer_update'
        }, status.HTTP_200_OK


class GoodsTransferListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_TRANSFER_LIST).get(data)
        return resp.auto_return(key_success='goods_transfer_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_TRANSFER_LIST).post(request.data)
        resp.result['message'] = SaleMsg.GOODS_TRANSFER_CREATE
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class GoodsTransferDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOODS_TRANSFER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='goods_transfer_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_TRANSFER_DETAIL.fill_key(pk=pk)).put(request.data)
        resp.result['message'] = SaleMsg.GOODS_TRANSFER_UPDATE
        return resp.auto_return()
