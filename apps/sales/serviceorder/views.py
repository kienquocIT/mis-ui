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

