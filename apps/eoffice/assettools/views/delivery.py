__all__ = ['AssetToolsDeliveryCreate', 'AssetToolsDeliveryCreateAPI', 'AssetToolsDeliveryList',
           'AssetToolsDeliveryListAPI', 'AssetToolsDeliveryDetail', 'AssetToolsDeliveryDetailAPI',
           'AssetToolsDeliveryEdit', 'AssetToolsDeliveryEditAPI']

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SYSTEM_STATUS, InputMappingProperties
from apps.shared.msg import BaseMsg
from apps.shared.msg.eoffice import AssetToolsMsg


class AssetToolsDeliveryCreate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/delivery/create.html',
        menu_active='menu_asset_delivery',
        breadcrumb='ASSET_TOOLS_DELIVERY_CREATE',
    )
    def get(self, request, *args, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).get()
        resp_config = response.result if response.state else {}
        return {
                   'product_type': resp_config['product_type']['id'],
               }, status.HTTP_200_OK


class AssetToolsDeliveryCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_DELIVERY).post(request.data)
        if resp.state:
            resp.result['message'] = f'{AssetToolsMsg.DELIVERY} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AssetToolsDeliveryList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/delivery/list.html',
        menu_active='menu_asset_delivery',
        breadcrumb='ASSET_TOOLS_DELIVERY_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AssetToolsDeliveryListAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_DELIVERY).get(request.query_params.dict())
        return resp.auto_return(key_success='asset_delivery_list')


class AssetToolsDeliveryDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/delivery/detail.html',
        menu_active='menu_asset_delivery',
        breadcrumb='ASSET_TOOLS_DELIVERY_DETAIL',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
               }, status.HTTP_200_OK


class AssetToolsDeliveryDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_DELIVERY_DETAIL.push_id(pk)).get()
        return resp.auto_return()


class AssetToolsDeliveryEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/delivery/edit.html',
        menu_active='menu_asset_delivery',
        breadcrumb='ASSET_TOOLS_DELIVERY_EDIT',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.ASSET_DELIVERY_DATA_MAP
        return {
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'asset_delivery_form',
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
               }, status.HTTP_200_OK


class AssetToolsDeliveryEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_DELIVERY_DETAIL.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{AssetToolsMsg.DELIVERY} {BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
