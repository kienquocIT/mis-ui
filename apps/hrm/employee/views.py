from django.views import View
from rest_framework import status

from apps.shared import mask_view, ServerAPI


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
