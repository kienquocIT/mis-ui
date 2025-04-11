__all__ = ['AssetToolsList', 'AssetToolsListAPI']

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class AssetToolsList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/list.html',
        menu_active='menu_asset_list',
        breadcrumb='ASSET_TOOLS_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AssetToolsListAPI(APIView):
    @classmethod
    def user_asset_tools_handle(cls, result):
        after = list(filter(lambda x: x['done'] > 0, result))
        return {'asset_tools_list': after}

    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_LIST).get(request.query_params.dict())
        return resp.auto_return(callback_success=self.user_asset_tools_handle)
