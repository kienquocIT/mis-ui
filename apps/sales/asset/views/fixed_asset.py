from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS
from apps.shared.msg import BaseMsg

__all__ = [
    'FixedAssetList',
    'FixedAssetCreate',
    'FixedAssetUpdate',
    'FixedAssetDetail',
    'FixedAssetDetailAPI',
    'FixedAssetListAPI',
    'AssetForLeaseListAPI',
    'AssetStatusLeaseListAPI',
    'FixedAssetListDDAPI',
    'ProductWarehouseListForFixedAssetAPI'
]


def create(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class FixedAssetList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/asset/fixed_asset/fixed_asset_list.html',
        menu_active='menu_fixed_asset',
        breadcrumb='FIXED_ASSET_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class FixedAssetCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/fixed_asset/fixed_asset_create.html',
        menu_active='menu_fixed_asset',
        breadcrumb='FIXED_ASSET_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'input_mapping_properties': InputMappingProperties.FIXED_ASSET_DATA_MAP,
            'form_id': 'form-fixed-asset',
        }
        return ctx, status.HTTP_200_OK


class FixedAssetDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/fixed_asset/fixed_asset_detail.html',
        menu_active='menu_fixed_asset',
        breadcrumb='FIXED_ASSET_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.FIXED_ASSET_DATA_MAP,
            'form_id': 'form-fixed-asset',
        }
        return ctx, status.HTTP_200_OK


class FixedAssetUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/fixed_asset/fixed_asset_update.html',
        menu_active='menu_fixed_asset',
        breadcrumb='FIXED_ASSET_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.FIXED_ASSET_DATA_MAP,
            'form_id': 'form-fixed-asset',
        }
        return ctx, status.HTTP_200_OK


class FixedAssetListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_LIST).get(data)
        return resp.auto_return(key_success='fixed_asset_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.FIXED_ASSET_LIST,
            msg=BaseMsg.SUCCESS
        )


class FixedAssetListDDAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_DD_LIST).get(data)
        return resp.auto_return(key_success='fixed_asset_dd_list')


class FixedAssetDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update(
            request=request,
            url=ApiURL.FIXED_ASSET_DETAIL,
            pk=pk,
            msg=BaseMsg.SUCCESS
        )


class AssetForLeaseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_FOR_LEASE_LIST).get(data)
        return resp.auto_return(key_success='fixed_asset_for_lease_list')


class AssetStatusLeaseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_STATUS_LEASE_LIST).get(data)
        return resp.auto_return(key_success='fixed_asset_status_lease_list')

class ProductWarehouseListForFixedAssetAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_WAREHOUSE_FOR_ASSET).get(data)
        return resp.auto_return(key_success='product_warehouse_list')

