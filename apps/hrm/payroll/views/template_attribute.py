from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import BaseMsg
from apps.shared.msg.hrm_employee import HRMMsg


class PayrollTemplAttrList(View):
    @mask_view(
        auth_require=True,
        template='hrm/payroll/template_attribute/list.html',
        breadcrumb='HRM_TEMPLATE_ATTRIBUTE_LIST_PAGE',
        menu_active='menu_payroll_template',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PayrollTemplAttrListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_ATTRIBUTE_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='template_attribute_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_ATTRIBUTE_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_TEMPLATE_ATTRIBUTE} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PayrollTemplAttrDetail(View):
    pass


class PayrollTemplateAttributeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_ATTRIBUTE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_ATTRIBUTE_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_PAYROLL_TEMPLATE} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
