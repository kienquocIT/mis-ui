from django.conf import settings
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties
import requests

from apps.shared.msg import MeetingScheduleMsg


class MeetingScheduleList(View):
    @mask_view(
        auth_require=True,
        template='meeting/meeting_list.html',
        breadcrumb='MEETING_SCHEDULE_LIST_PAGE',
        menu_active='menu_meeting_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class MeetingScheduleCreate(View):
    @mask_view(
        auth_require=True,
        template='meeting/meeting_create.html',
        breadcrumb='MEETING_SCHEDULE_CREATE_PAGE',
        menu_active='menu_meeting_create',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(user=request.user, url=ApiURL.MEETING_ZOOM_CONFIG_LIST).get()
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
            'zoom_config': resp0.result[0] if len(resp0.result) > 0 else '',
            'employee_current': resp1.result,
            'company_current': request.user.company_current_data
        }, status.HTTP_200_OK


class MeetingScheduleDetail(View):
    @mask_view(
        auth_require=True,
        template='meeting/meeting_detail.html',
        breadcrumb='MEETING_SCHEDULE_DETAIL_PAGE',
        menu_active='menu_meeting_create',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(user=request.user, url=ApiURL.MEETING_ZOOM_CONFIG_LIST).get()
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
            'zoom_config': resp0.result[0] if len(resp0.result) > 0 else '',
            'employee_current': resp1.result,
            'company_current': request.user.company_current_data
        }, status.HTTP_200_OK


class MeetingScheduleListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_SCHEDULE_LIST).get(params)
        return resp.auto_return(key_success='meeting_schedule_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_SCHEDULE_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = MeetingScheduleMsg.MEETING_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class MeetingScheduleDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_SCHEDULE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='meeting_schedule_detail')
