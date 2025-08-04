import json
from datetime import datetime

from django.http import JsonResponse
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class HRMAttendanceList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/attendance/attendance/attendance_list.html',
        breadcrumb='HRM_ATTENDANCE_LIST_PAGE',
        menu_active='menu_attendance_list',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {'data': {'current_period': resp1.result[0]}}, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class AttendanceListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data_params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ATTENDANCE_LIST).get(data_params)
        return resp.auto_return(key_success='attendance_list')
