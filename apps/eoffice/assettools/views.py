__all__ = ['AssetToolsConfigView', 'AssetToolsConfigViewAPI']

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import BaseMsg


class AssetToolsConfigView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/config.html',
        menu_active='menu_asset_tools_config',
        breadcrumb='ASSET_TOOLS_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AssetToolsConfigViewAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).get()
        if resp.state:
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = f'{BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
