from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, HRMsg


class PayrollAttributeList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/payroll/payrollattribute/list.html',
        menu_active='menu_payroll_attribute',
        breadcrumb='PAYROLL_ATTRIBUTE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PayrollAttributeListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PAYROLL_ATTRIBUTE).get(params)
        return resp.auto_return(key_success="payroll_attribute_list")

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYROLL_ATTRIBUTE).post(request.data)
        if resp.state:
            resp.result['message'] = HRMsg.PAYROLL_ATTRIBUTE_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
