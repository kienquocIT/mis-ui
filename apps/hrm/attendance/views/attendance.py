from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, BaseView
from apps.shared.msg import ReportMsg

FILTER_MONTH = (
    (1, ReportMsg.MONTH_JANUARY),
    (2, ReportMsg.MONTH_FEBRUARY),
    (3, ReportMsg.MONTH_MARCH),
    (4, ReportMsg.MONTH_APRIL),
    (5, ReportMsg.MONTH_MAY),
    (6, ReportMsg.MONTH_JUNE),
    (7, ReportMsg.MONTH_JULY),
    (8, ReportMsg.MONTH_AUGUST),
    (9, ReportMsg.MONTH_SEPTEMBER),
    (10, ReportMsg.MONTH_OCTOBER),
    (11, ReportMsg.MONTH_NOVEMBER),
    (12, ReportMsg.MONTH_DECEMBER),
)


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
            return {'data': {'current_period': resp1.result[0]}, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK
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

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.ATTENDANCE_LIST,
        )
