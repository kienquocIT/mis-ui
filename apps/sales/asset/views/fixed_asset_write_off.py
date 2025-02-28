from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS
from apps.shared.msg import BaseMsg

__all__ = [
    'FixedAssetWriteOffList',
    'FixedAssetWriteOffCreate',
    'FixedAssetWriteOffDetail',
    'FixedAssetWriteOffUpdate',
    'FixedAssetWriteOffListAPI',
    'FixedAssetWriteOffDetailAPI'
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

class FixedAssetWriteOffList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/asset/fixed-asset-write-off/fa_write_off_list.html',
        menu_active='menu_fixed_asset_writeoff',
        breadcrumb='FIXED_ASSET_WRITE_OFF_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK

class FixedAssetWriteOffCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/fixed-asset-write-off/fa_write_off_create.html',
        menu_active='menu_fixed_asset_writeoff',
        breadcrumb='FIXED_ASSET_WRITE_OFF_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'input_mapping_properties': InputMappingProperties.FIXED_ASSET_WRITEOFF_DATA_MAP,
            'form_id': 'form-fixed-asset-writeoff',
        }
        return ctx, status.HTTP_200_OK

class FixedAssetWriteOffDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/fixed-asset-write-off/fa_write_off_detail.html',
        menu_active='menu_fixed_asset_writeoff',
        breadcrumb='FIXED_ASSET_WRITE_OFF_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.FIXED_ASSET_WRITEOFF_DATA_MAP,
            'form_id': 'form-fixed-asset-writeoff',
        }
        return ctx, status.HTTP_200_OK


class FixedAssetWriteOffUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/fixed-asset-write-off/fa_write_off_update.html',
        menu_active='menu_fixed_asset_writeoff',
        breadcrumb='FIXED_ASSET_WRITE_OFF_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.FIXED_ASSET_WRITEOFF_DATA_MAP,
            'form_id': 'form-fixed-asset-writeoff',
        }
        return ctx, status.HTTP_200_OK


class FixedAssetWriteOffListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_WRITE_OFF_LIST).get(data)
        return resp.auto_return(key_success='fixed_asset_writeoff_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.FIXED_ASSET_WRITE_OFF_LIST,
            msg=BaseMsg.SUCCESS
        )

class FixedAssetWriteOffDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_WRITE_OFF_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update(
            request=request,
            url=ApiURL.FIXED_ASSET_WRITE_OFF_DETAIL,
            pk=pk,
            msg=BaseMsg.SUCCESS
        )
