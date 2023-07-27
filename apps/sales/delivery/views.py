from functools import reduce

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PICKING_STATE

__all__ = [
    'DeliveryConfigDetail', 'DeliveryConfigDetailAPI',
    'OrderPickingList', 'OrderPickingListAPI', 'OrderPickingDetail', 'OrderPickingDetailAPI',
    'OrderDeliveryList', 'OrderDeliveryListAPI', 'OrderDeliveryDetail', 'OrderDeliveryDetailAPI'
]

from apps.shared.constant import DELIVERY_STATE


class DeliveryConfigDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/delivery/config.html',
        menu_active='menu_delivery_config',
        breadcrumb='DELIVERY_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).get()
        return {'config_data': res.result}, status.HTTP_200_OK


class DeliveryConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).get()
        return resp.auto_return(key_success='config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).put(request.data)
        return resp.auto_return(key_success='result')


class OrderPickingList(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/picking/list.html',
        breadcrumb='ORDER_PICKING_LIST_PAGE',
        menu_active='menu_order_picking_list',
    )
    def get(self, request, *args, **kwargs):
        return {'state_choices': {key: value for key, value in PICKING_STATE}}, status.HTTP_200_OK


class OrderPickingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PICKING_LIST).get()
        if resp.state:
            list_sub = []
            for item in resp.result:
                list_sub.extend(item.get('sub_list', []))
            return {'picking_list': list_sub}, status.HTTP_200_OK
        return resp.auto_return()


class OrderPickingDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/picking/detail.html',
        breadcrumb='ORDER_PICKING_DETAIL_PAGE',
        menu_active='menu_order_picking_list',
    )
    def get(self, request, *args, pk, **kwargs):
        result = {
            'pk': pk,
            'state_choices': {key: value for key, value in PICKING_STATE},
        }
        return result, status.HTTP_200_OK


class OrderPickingDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PICKING_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='picking_detail')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PICKING_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


class OrderDeliveryList(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/list.html',
        breadcrumb='ORDER_DELIVERY_LIST_PAGE',
        menu_active='menu_order_delivery_list',
    )
    def get(self, request, *args, **kwargs):
        return {'state_choices': {key: value for key, value in DELIVERY_STATE}}, status.HTTP_200_OK


class OrderDeliveryListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LIST).get()
        if resp.state:
            list_sub = []
            for item in resp.result:
                list_sub.extend(item.get('sub_list', []))
            return {'delivery_list': list_sub}, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LIST.push_id(pk=pk)).put(request.data)
        if resp.state:
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class OrderDeliveryDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/detail.html',
        breadcrumb='ORDER_DELIVERY_DETAIL_PAGE',
        menu_active='menu_order_delivery_list',
    )
    def get(self, request, *args, pk, **kwargs):
        result = {
            'pk': pk,
            'state_choices': {key: value for key, value in DELIVERY_STATE},
        }
        return result, status.HTTP_200_OK


class OrderDeliveryDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SUB_LIST.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SUB_LIST.push_id(pk)).put(request.data)
        return resp.auto_return()
