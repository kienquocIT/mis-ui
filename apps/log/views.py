from rest_framework import status
from rest_framework.parsers import MultiPartParser, FileUploadParser, FormParser
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.log.seriallizers import TicketErrorCreateSerializer

__all__ = [
    'TicketErrorCreateAPI',
    'ActivityLogListAPI',
    'MyNotifyNoDoneCountAPI',
    'MyNotifySeenAllAPI',
    'MyNotifyAllAPI',
    'MyNotifyCleanAllAPI',
]

from apps.shared.msg import BaseMsg


class TicketErrorCreateAPI(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        ser = TicketErrorCreateSerializer(
            data=request.data, context={'user_obj': request.user, 'attachments': request.FILES.getlist('attachments')}
        )
        state = ser.is_valid(raise_exception=False)

        if state is True:
            obj = ser.save()
            return {'detail': 'Success', 'ticket': {'id': str(obj.id), 'code': str(obj.code)}}, status.HTTP_200_OK
        return {'errors': ser.errors}, status.HTTP_400_BAD_REQUEST


class ActivityLogListAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.LOG_ACTIVITIES, user=request.user).get(data=request.query_params)
        if resp.state:
            return {'log_data': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class MyNotifyNoDoneCountAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.LOG_MY_NOTIFY_COUNT, user=request.user).get()
        if resp.state:
            return {'count': resp.result.get('count', 0)}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class MyNotifyAllAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.LOG_MY_NOTIFY_DATA_ALL, user=request.user).get()
        if resp.state:
            return {'notify_data': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class MyNotifySeenAllAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.LOG_MY_NOTIFY_SEEN_ALL, user=request.user).put(data={})
        if resp.state:
            return {'detail': BaseMsg.SUCCESS}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class MyNotifyCleanAllAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def delete(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.LOG_MY_NOTIFY_CLEAN_ALL, user=request.user).delete()
        if resp.state:
            return {'detail': BaseMsg.SUCCESS}, status.HTTP_204_NO_CONTENT
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
