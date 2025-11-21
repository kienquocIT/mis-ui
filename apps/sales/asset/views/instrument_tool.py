from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS
from apps.shared.msg import BaseMsg

__all__ = [
    'InstrumentToolList',
    'InstrumentToolCreate',
    'InstrumentToolDetail',
    'InstrumentToolUpdate',
    'InstrumentToolListAPI',
    'InstrumentToolDetailAPI',
    'ToolForLeaseListAPI',
    'ToolStatusLeaseListAPI',
    'InstrumentToolDDListAPI',
]


def create(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class InstrumentToolList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/asset/instrument-tool/instrument_tool_list.html',
        menu_active='menu_instrument_tool',
        breadcrumb='INSTRUMENT_TOOL_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class InstrumentToolCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/instrument-tool/instrument_tool_create.html',
        menu_active='menu_instrument_tool',
        breadcrumb='INSTRUMENT_TOOL_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'input_mapping_properties': InputMappingProperties.INSTRUMENT_TOOL_DATA_MAP,
            'form_id': 'form-instrument-tool',
        }
        return ctx, status.HTTP_200_OK


class InstrumentToolDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/instrument-tool/instrument_tool_detail.html',
        menu_active='menu_instrument_tool',
        breadcrumb='INSTRUMENT_TOOL_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.INSTRUMENT_TOOL_DATA_MAP,
            'form_id': 'form-fixed-asset',
        }
        return ctx, status.HTTP_200_OK


class InstrumentToolUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/asset/instrument-tool/instrument_tool_update.html',
        menu_active='menu_instrument_tool',
        breadcrumb='INSTRUMENT_TOOL_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.INSTRUMENT_TOOL_DATA_MAP,
            'form_id': 'form-fixed-asset',
        }
        return ctx, status.HTTP_200_OK


class InstrumentToolListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_LIST).get(data)
        return resp.auto_return(key_success='instrument_tool_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.INSTRUMENT_TOOL_LIST,
            msg=BaseMsg.SUCCESS
        )


class InstrumentToolDDListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_DD_LIST).get(data)
        return resp.auto_return(key_success='instrument_tool_dd_list')


class InstrumentToolDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update(
            request=request,
            url=ApiURL.INSTRUMENT_TOOL_DETAIL,
            pk=pk,
            msg=BaseMsg.SUCCESS
        )


class ToolForLeaseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_FOR_LEASE_LIST).get(data)
        return resp.auto_return(key_success='instrument_tool_for_lease_list')


class ToolStatusLeaseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_STATUS_LEASE_LIST).get(data)
        return resp.auto_return(key_success='instrument_tool_status_lease_list')
