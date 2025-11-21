from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties
from apps.shared.msg import BaseMsg
from apps.shared.msg.hrm_employee import HRMMsg


class PayrollTemplateList(View):
    @mask_view(
        auth_require=True,
        template='hrm/payroll_template/list.html',
        breadcrumb='HRM_PAYROLL_TEMPLATE_LIST_PAGE',
        menu_active='menu_payroll_template',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PayrollTemplateListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_TEMPLATE_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='payroll_template_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_TEMPLATE_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_PAYROLL_TEMPLATE} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PayrollTemplateCreate(View):
    @mask_view(
        auth_require=True,
        template='hrm/payroll_template/create.html',
        breadcrumb='HRM_PAYROLL_TEMPLATE_CREATE_PAGE',
        menu_active='menu_payroll_template',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PayrollTemplateDetail(View):
    @mask_view(
        auth_require=True,
        template='hrm/payroll_template/detail.html',
        breadcrumb='HRM_PAYROLL_TEMPLATE_DETAIL_PAGE',
        menu_active='menu_payroll_template',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'doc_id': pk,
               }, status.HTTP_200_OK


class PayrollTemplateDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_TEMPLATE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_PAYROLL_TEMPLATE_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_PAYROLL_TEMPLATE} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PayrollTemplateUpdate(View):
    @mask_view(
        auth_require=True,
        template='hrm/payroll_template/update.html',
        breadcrumb='HRM_PAYROLL_TEMPLATE_UPDATE_PAGE',
        menu_active='menu_payroll_template',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'doc_id': pk,
                   'input_mapping_properties': InputMappingProperties.HRM_PAYROLL_TEMPLATE,
                   'form_id': 'payroll_template_form',
               }, status.HTTP_200_OK
