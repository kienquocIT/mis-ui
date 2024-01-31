__all__ = ['AssetToolsReturnCreate', 'AssetToolsReturnCreateAPI', 'AssetToolsReturnList', 'AssetToolsReturnListAPI',
           'AssetToolsReturnDetail', 'AssetToolsReturnDetailAPI', 'AssetToolsReturnEdit', 'AssetToolsReturnEditAPI']

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SYSTEM_STATUS, InputMappingProperties
from apps.shared.msg import BaseMsg
from apps.shared.msg.eoffice import AssetToolsMsg


class AssetToolsReturnCreate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/assetreturn/create.html',
        menu_active='menu_asset_return',
        breadcrumb='ASSET_TOOLS_RETURN_CREATE',
    )
    def get(self, request, *args, **kwargs):
        return {'list_from_app': 'assettools.assettoolsreturn.create'}, status.HTTP_200_OK


class AssetToolsReturnCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_RETURN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{AssetToolsMsg.RETURN} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AssetToolsReturnList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/assetreturn/list.html',
        menu_active='menu_asset_return',
        breadcrumb='ASSET_TOOLS_RETURN_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AssetToolsReturnListAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_RETURN_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='asset_return_list')


class AssetToolsReturnDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/assetreturn/detail.html',
        menu_active='menu_asset_return',
        breadcrumb='ASSET_TOOLS_RETURN_DETAIL',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
               }, status.HTTP_200_OK


class AssetToolsReturnDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_RETURN_DETAIL.push_id(pk)).get()
        return resp.auto_return()


class AssetToolsReturnEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/assetreturn/edit.html',
        menu_active='menu_asset_return',
        breadcrumb='ASSET_TOOLS_RETURN_EDIT',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.ASSET_RETURN_DATA_MAP
        return {
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'asset_return_form',
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
                   'list_from_app': 'assettools.assettoolsreturn.edit'
               }, status.HTTP_200_OK


class AssetToolsReturnEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_RETURN_DETAIL.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{AssetToolsMsg.RETURN} {BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
