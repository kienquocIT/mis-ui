from django.views import View
from rest_framework import status

from apps.shared import mask_view, SYSTEM_STATUS, ServerAPI, ApiURL


class PayrollConfigList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/payroll/payrollconfig/create.html',
        menu_active='menu_payroll_config_list',
        breadcrumb='PAYROLL_CONFIG_LIST_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class PayrollConfigListAPI(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PAYROLL_CONFIG_LIST).get(params)
        return resp.auto_return(key_success='payroll_config_list')
