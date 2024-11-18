import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS
from apps.shared.msg import CoreMsg


def create_recurrence(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_recurrence(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class RecurrenceList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/recurrence/recurrence_list.html',
        menu_active='menu_recurring_order',
        breadcrumb='RECURRENCE_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class RecurrenceCreate(View):
    @mask_view(
        auth_require=True,
        template='core/recurrence/recurrence_create.html',
        menu_active='menu_recurring_order',
        breadcrumb='RECURRENCE_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        return ctx, status.HTTP_200_OK


class RecurrenceListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.RECURRENCE_LIST).get(data)
        return resp.auto_return(key_success='recurrence_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_recurrence(
            request=request,
            url=ApiURL.RECURRENCE_LIST,
            msg=CoreMsg.RECURRENCE_CREATE
        )


class RecurrenceDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/recurrence/recurrence_detail.html',
        menu_active='menu_recurring_order',
        breadcrumb='RECURRENCE_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
               }, status.HTTP_200_OK


class RecurrenceUpdate(View):
    @mask_view(
        auth_require=True,
        template='core/recurrence/recurrence_update.html',
        breadcrumb='menu_recurring_order',
        menu_active='RECURRENCE_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
        }
        return ctx, status.HTTP_200_OK


class RecurrenceDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RECURRENCE_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_recurrence(
            request=request,
            url=ApiURL.RECURRENCE_DETAIL,
            pk=pk,
            msg=CoreMsg.RECURRENCE_UPDATE
        )
