from django.shortcuts import render
from django.views import View
from apps.shared import ServerAPI, mask_view, SYSTEM_STATUS, ApiURL, SaleMsg, InputMappingProperties
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared.msg import BaseMsg


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

class GroupOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/group_order/group_order_list.html',
        menu_active='menu_group_order_list',
        breadcrumb='GROUP_ORDER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK

class GroupOrderCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/group_order/group_order_create.html',
        menu_active='menu_group_order_list',
        breadcrumb='GROUP_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
        }
        return ctx, status.HTTP_200_OK

class GroupOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/group_order/group_order_detail.html',
        menu_active='menu_group_order_list',
        breadcrumb='GROUP_ORDER_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
        }
        return ctx, status.HTTP_200_OK

class GroupOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/group_order/group_order_update.html',
        menu_active='menu_group_order_list',
        breadcrumb='GROUP_ORDER_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'form_id': 'form-group-order',
        }
        return ctx, status.HTTP_200_OK

class GroupOrderProductList(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GROUP_ORDER_PRODUCT_LIST).get(data)
        return resp.auto_return(key_success='group_order_product_list')


class GroupOrderListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GROUP_ORDER_LIST).get(data)
        return resp.auto_return(key_success='group_order_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.GROUP_ORDER_LIST,
            msg=BaseMsg.SUCCESS
        )

class GroupOrderDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GROUP_ORDER_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update(
            request=request,
            url=ApiURL.GROUP_ORDER_DETAIL,
            pk=pk,
            msg=BaseMsg.SUCCESS
        )