import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS, CLOSE_OPEN_STATUS


def create_production_order(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_production_order(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class ProductionOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/production/productionorder/production_order_list.html',
        menu_active='menu_production_order_list',
        breadcrumb='PRODUCTION_ORDER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS, 'stt_cp': CLOSE_OPEN_STATUS}, status.HTTP_200_OK


class ProductionOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/productionorder/production_order_create.html',
        menu_active='menu_production_order_list',
        breadcrumb='PRODUCTION_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        return ctx, status.HTTP_200_OK


class ProductionOrderListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_ORDER_LIST).get(data)
        return resp.auto_return(key_success='production_order_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_production_order(
            request=request,
            url=ApiURL.PRODUCTION_ORDER_LIST,
            msg=SaleMsg.PRODUCTION_ORDER_CREATE
        )


class ProductionOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/production/productionorder/production_order_detail.html',
        menu_active='menu_production_order_list',
        breadcrumb='PRODUCTION_ORDER_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
                   'employee_current': request.user.employee_current_data,
               }, status.HTTP_200_OK


class ProductionOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/productionorder/production_order_update.html',
        menu_active='menu_production_order_list',
        breadcrumb='PRODUCTION_ORDER_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'employee_current': request.user.employee_current_data,
        }
        return ctx, status.HTTP_200_OK


class ProductionOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_ORDER_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_production_order(
            request=request,
            url=ApiURL.PRODUCTION_ORDER_DETAIL,
            pk=pk,
            msg=SaleMsg.PRODUCTION_ORDER_UPDATE
        )


class ProductionOrderDDListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_ORDER_DD_LIST).get(data)
        return resp.auto_return(key_success='production_order_dd')


class ProductionOrderManualDoneListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_production_order(
            request=request,
            url=ApiURL.PRODUCTION_ORDER_MANUAL_DONE_LIST,
            msg=SaleMsg.PRODUCTION_ORDER_UPDATE
        )
