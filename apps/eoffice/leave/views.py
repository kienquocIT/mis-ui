from django.views import View

from apps.shared import mask_view, ServerAPI, ApiURL

__all__ = ['LeaveConfigDetail']


class LeaveConfigDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/config.html',
        menu_active='menu_leave_config',
        breadcrumb='LEAVE_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).get()
        return resp.auto_return(key_success='config_data')
