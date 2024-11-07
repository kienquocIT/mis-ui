from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.constant import GENDER_TYPE, MARITAL_STT
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


class HRMEmployeeCreate(View):
    @mask_view(
        auth_require=True,
        template='hrm/employee/create.html',
        breadcrumb='HRM_EMPLOYEE_CREATE_PAGE',
        menu_active='menu_employee_data_list',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'gender': GENDER_TYPE,
                   'marital': MARITAL_STT,
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


