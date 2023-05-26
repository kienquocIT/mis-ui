from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PICKING_STATE

__all__ = [
    'DeliveryConfigDetail', 'DeliveryConfigDetailAPI',
    'OrderPickingList', 'OrderPickingListAPI', 'OrderPickingDetail', 'OrderPickingDetailAPI',
    'OrderPickingDetailProductsAPI',
]


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
        res = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).get()
        if res.state:
            return {'config': res.result}, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).put(request.data)
        if res.state:
            return {'result': res.result}, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST


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
            return {'picking_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class OrderPickingDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/picking/detail.html',
        breadcrumb='ORDER_PICKING_DETAIL_PAGE',
        menu_active='menu_order_picking_list',
    )
    def get(self, request, *args, pk, **kwargs):
        return {'pk': pk, 'state_choices': {key: value for key, value in PICKING_STATE}}, status.HTTP_200_OK


class OrderPickingDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PICKING_DETAIL.fill_key(pk=pk)).get()
        if resp.state:
            return {'picking_detail': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
