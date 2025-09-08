from django.contrib.auth.models import AnonymousUser
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
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if resp.state:
            task_config = resp.result
        ctx = {
            'form_id': '',
            'app_id': '',

            'employee_current': employee_current,
            'task_config': task_config,
            'employee_info': request.user.employee_current_data,
        }
        return ctx, status.HTTP_200_OK
