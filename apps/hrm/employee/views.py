from django.conf import settings
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.constant import GENDER_TYPE, MARITAL_STT, LIST_BANK, CONTRACT_TYPE
from apps.shared.msg import BaseMsg
from apps.shared.msg.hrm_employee import HRMMsg


class HRMEmployeeList(View):
    @mask_view(
        auth_require=True,
        template='hrm/employee/list.html',
        breadcrumb='HRM_EMPLOYEE_LIST_PAGE',
        menu_active='menu_employee_data_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class HRMEmployeeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_INFO_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='employee_info_list')


class HRMEmployeeCreate(View):
    @mask_view(
        auth_require=True,
        template='hrm/employee/create.html',
        breadcrumb='HRM_EMPLOYEE_CREATE_PAGE',
        menu_active='menu_employee_data_list',
    )
    def get(self, request, *args, **kwargs):
        language = getattr(request.user, 'language', settings.LANGUAGE_CODE)
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_LIST_DD).get({
            'application_model_code': "employeeinfo"
        })
        template_list = []
        if resp.state:
            template_list = resp.result
        return {
                   'gender': GENDER_TYPE,
                   'marital': MARITAL_STT,
                   'bank': [{
                       'id': item[0], 'title': item[3] if language == 'vi' else item[2],
                       'code': item[1]
                   } for item in LIST_BANK],
                   'contract_type': [{
                       'id': item[0],
                       'title': item[1]
                   } for item in CONTRACT_TYPE],
                   'template_list': template_list
               }, ServerAPI.empty_200()


class HRMEmployeeCreateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_INFO_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_EMPLOYEE_INFO} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class HRMEmployeeNotMapHRM(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_NOT_MAP_HRM).get(request.query_params.dict())
        return resp.auto_return(key_success='emp_not_map')


class HRMEmployeeDetail(View):
    @mask_view(
        auth_require=True,
        template='hrm/employee/detail.html',
        breadcrumb='HRM_EMPLOYEE_DETAIL_PAGE',
        menu_active='menu_employee_data_list',
        jsi18n='hrm',
    )
    def get(self, request, *args, pk, **kwargs):
        language = getattr(request.user, 'language', settings.LANGUAGE_CODE)
        return {
                   'gender': GENDER_TYPE,
                   'marital': MARITAL_STT,
                   'pk': pk,
                   'bank': [{
                       'id': item[0], 'title': item[3] if language == 'vi' else item[2],
                       'code': item[1]
                   } for item in LIST_BANK],
                   'contract_type': [{
                       'id': item[0],
                       'title': item[1]
                   } for item in CONTRACT_TYPE],
               }, ServerAPI.empty_200()


class HRMEmployeeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_INFO_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()


class HRMEmployeeUpdate(View):
    @mask_view(
        auth_require=True,
        template='hrm/employee/update.html',
        breadcrumb='HRM_EMPLOYEE_UPDATE_PAGE',
        menu_active='menu_employee_data_list',
        jsi18n='hrm',
    )
    def get(self, request, *args, pk, **kwargs):
        language = getattr(request.user, 'language', settings.LANGUAGE_CODE)
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_LIST_DD).get(
            {
                'application_model_code': "employeeinfo"
            }
        )
        template_list = []
        if resp.state:
            template_list = resp.result
        return {
                   'gender': GENDER_TYPE,
                   'marital': MARITAL_STT,
                   'bank': [{
                                'id': item[0], 'title': item[3] if language == 'vi' else item[2],
                                'code': item[1]
                            } for item in LIST_BANK],
                   'pk': pk,
                   'contract_type': [{
                       'id': item[0],
                       'title': item[1]
                   } for item in CONTRACT_TYPE],
                   'template_list': template_list
               }, ServerAPI.empty_200()


class HRMEmployeeUpdateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_INFO_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_EMPLOYEE_INFO} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# ############## API FOR TAB CONTRACT ##############
class HRMEmployeeContractList(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_CONTRACT_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='employee_contract_list')


class HRMEmployeeContractDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_CONTRACT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()


# ############## SIGNATURE ATTACHMENT ##############
class HRMEmployeeSignatureAttachmentListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_SIGNATURE_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='attachment_list')


class HRMSignatureAttachmentUpdateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_SIGNATURE_UPDATE.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_EMPLOYEE_INFO} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# ########## RUNTIME REQUEST SIGNATURE #########
class HRMRuntimeSignatureAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_CONTRACT_RUNTIME).post(request.data)
        if resp.state:
            resp.result['message'] = HRMMsg.HRM_REQUEST_SIGNING
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
