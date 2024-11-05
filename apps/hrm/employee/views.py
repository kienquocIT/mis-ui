from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


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
        return ServerAPI.empty_200()


class HRMEmployeeNotMapHRM(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_EMPLOYEE_NOT_MAP_HRM).get(request.query_params.dict())
        return resp.auto_return(key_success='empl_not_map')
