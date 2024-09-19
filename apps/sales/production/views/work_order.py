import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS


def create_work_order(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_work_order(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class WorkOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/production/workorder/work_order_list.html',
        menu_active='menu_work_order_list',
        breadcrumb='PRODUCTION_ORDER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class WorkOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/workorder/work_order_create.html',
        menu_active='',
        breadcrumb='PRODUCTION_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        return ctx, status.HTTP_200_OK


class WorkOrderListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WORK_ORDER_LIST).get(data)
        return resp.auto_return(key_success='work_order_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_work_order(
            request=request,
            url=ApiURL.WORK_ORDER_LIST,
            msg=SaleMsg.WORK_ORDER_CREATE
        )


class WorkOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/production/workorder/work_order_detail.html',
        menu_active='menu_work_order_list',
        breadcrumb='PRODUCTION_ORDER_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
               }, status.HTTP_200_OK


class WorkOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/workorder/work_order_update.html',
        menu_active='menu_work_order_list',
        breadcrumb='PRODUCTION_ORDER_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
        }
        return ctx, status.HTTP_200_OK


class WorkOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORK_ORDER_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_work_order(
            request=request,
            url=ApiURL.WORK_ORDER_DETAIL,
            pk=pk,
            msg=SaleMsg.WORK_ORDER_UPDATE
        )


class WorkOrderDDListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WORK_ORDER_DD_LIST).get(data)
        return resp.auto_return(key_success='work_order_dd')
