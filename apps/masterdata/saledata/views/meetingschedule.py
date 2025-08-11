import requests
import xmltodict
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck


class MeetingScheduleMasterdataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/meetingschedule.html',
        breadcrumb='MEETING_CONFIG_PAGE',
        menu_active='id_menu_master_data_meeting_schedule',
        icon_cls='fas fa-chalkboard-teacher',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class MeetingRoomListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_ROOM_LIST).get(params)
        return resp.auto_return(key_success='meeting_room_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_ROOM_LIST).post(request.data)
        return resp.auto_return()


class MeetingRoomDetailAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_ROOM_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='meeting_room')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.MEETING_ROOM_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='meeting_room')
