from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg.hr import HRMsg


class PayrollConfigDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='hrm/payroll/payrollconfig/payroll_config.html',
        menu_active='menu_payroll_config',
        breadcrumb='PAYROLL_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PayrollConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYROLL_CONFIG).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYROLL_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = HRMsg.PAYROLL_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
