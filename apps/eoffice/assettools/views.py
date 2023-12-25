__all__=['AssetToolsConfigView']

from django.views import View

from apps.shared import mask_view, ServerAPI, ApiURL


class AssetToolsConfigView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/assettools/config.html',
        menu_active='menu_asset_tools_config',
        breadcrumb='LEAVE_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_CONFIG).get()
        return resp.auto_return()
