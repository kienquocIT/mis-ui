from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PAID_BY

__all__ = ['LeaveConfigDetail', 'LeaveTypeConfigAPI', 'WorkingCalendarConfig', 'WorkingYearConfig',
           'WorkingHolidayConfig']

from apps.shared.msg import LeaveMsg


class LeaveConfigDetail(View):

    @classmethod
    def callback_success(cls, result):
        return {
            'PAID_BY': PAID_BY,
            'config_data': result
        }

    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/config.html',
        menu_active='menu_leave_config',
        breadcrumb='LEAVE_CONFIG_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_CONFIG).get()
        return resp.auto_return(callback_success=self.callback_success)


class LeaveTypeConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_CREATE).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_TYPE_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.LEAVE_TYPE_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAVE_DETAIL.fill_key(pk=pk)).delete({})
        if resp.state:
            return {'message': LeaveMsg.LEAVE_TYPE_DELETE}, status.HTTP_200_OK
        return resp.auto_return()


class WorkingCalendarConfig(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='eoffice/leave/working_calendar.html',
        menu_active='menu_working_calendar',
        breadcrumb='WORKING_CALENDAR_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).get()
        return resp.auto_return(key_success="wc_cfg")


class WorkingCalendarConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_CALENDAR_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class WorkingYearConfig(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_YEAR).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_YEAR_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_YEAR.push_id(pk)).delete({})
        if resp.state:
            return {'message': LeaveMsg.WORKING_YEAR_DELETE}, status.HTTP_200_OK
        return resp.auto_return()


class WorkingHolidayConfig(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_HOLIDAY).post(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_HOLIDAY_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_HOLIDAY.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = LeaveMsg.WORKING_HOLIDAY_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_HOLIDAY.push_id(pk)).delete({})
        if resp.state:
            return {'message': LeaveMsg.WORKING_HOLIDAY_DELETE}, status.HTTP_200_OK
        return resp.auto_return()
