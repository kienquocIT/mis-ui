from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, BaseView
from apps.shared.constant import SYSTEM_STATUS


class AttendanceDeviceList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='hrm/attendance/deviceintegrate/attendance_device.html',
        menu_active='menu_device_integrate_employee_list',
        breadcrumb='DEVICE_INTEGRATE_EMPLOYEE_LIST_PAGE',
        icon_cls='fas fa-repeat',
        icon_bg='bg-sky',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AttendanceDeviceListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return BaseView.run_list(
            request=request,
            url=ApiURL.ATTENDANCE_DEVICE_LIST,
            key_success='attendance_device_list'
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.ATTENDANCE_DEVICE_LIST,
        )


class AttendanceDeviceDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.ATTENDANCE_DEVICE_DETAIL,
            pk=pk,
        )


class DeviceIntegrateEmployeeList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='hrm/attendance/deviceintegrate/device_integrate_employee.html',
        menu_active='menu_device_integrate_employee_list',
        breadcrumb='DEVICE_INTEGRATE_EMPLOYEE_LIST_PAGE',
        icon_cls='fas fa-repeat',
        icon_bg='bg-sky',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class DeviceIntegrateEmployeeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return BaseView.run_list(
            request=request,
            url=ApiURL.DEVICE_INTEGRATE_EMPLOYEE_LIST,
            key_success='device_integrate_employee_list'
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.DEVICE_INTEGRATE_EMPLOYEE_LIST,
        )


class DeviceIntegrateEmployeeDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.DEVICE_INTEGRATE_EMPLOYEE_DETAIL,
            pk=pk,
        )
