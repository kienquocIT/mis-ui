from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, SYSTEM_STATUS


class ServiceOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/serviceorder/service_order_list.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class ServiceOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/serviceorder/service_order_create.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'form_id': '',
            'app_id': ''
        }
        return ctx, status.HTTP_200_OK


class ServiceOrderDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/serviceorder/service_order_detail.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK


class ServiceOrderUpdate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/serviceorder/service_order_update.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK


class ServiceOrderListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SERVICE_ORDER_LIST).get(params)
        return resp.auto_return(key_success='service_order_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SERVICE_ORDER_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.SERVICE_ORDER_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()
