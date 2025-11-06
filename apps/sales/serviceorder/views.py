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
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ServiceOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/serviceorder/service_order_create.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_CREATE_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
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
            'form_id': 'form-create-service-order',
            'app_id': '',
            'list_from_app': 'serviceorder.serviceorder.create',

            'employee_current': employee_current,
            'task_config': task_config,
            'employee_info': request.user.employee_current_data,
        }
        return ctx, status.HTTP_200_OK


class ServiceOrderDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/serviceorder/service_order_detail.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_DETAIL_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, pk, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if resp.state:
            task_config = resp.result
        return {
                   'pk': pk,

                   'employee_current': employee_current,
                   'task_config': task_config,
                   'employee_info': request.user.employee_current_data,
               }, status.HTTP_200_OK


class ServiceOrderUpdate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/serviceorder/service_order_update.html',
        menu_active='menu_service_order_list',
        breadcrumb='SERVICE_ORDER_UPDATE_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, pk, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if resp.state:
            task_config = resp.result
        ctx = {
            'pk': pk,
            'data': {'doc_id': pk},
            'form_id': 'form-update-service-order',

            'employee_current': employee_current,
            'task_config': task_config,
            'employee_info': request.user.employee_current_data,
        }
        return ctx, status.HTTP_200_OK


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


class ServiceOrderDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.SERVICE_ORDER_DETAIL.fill_key(pk=pk)
        ).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.SERVICE_ORDER_DETAIL.fill_key(pk=pk)
        ).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.SERVICE_ORDER_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# related
class ServiceOrderDetailDashboard(View):
    @mask_view(
        auth_require=True,
        template='sales/serviceorder/service_order_detail_dashboard_echarts.html',
        breadcrumb='SERVICE_ORDER_DETAIL_DASHBOARD_PAGE',
        icon_cls='bi bi-clipboard-data',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ServiceOrderDetailDashboardAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SERVICE_ORDER_DETAIL_DASHBOARD.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='service_order_detail_dashboard')


class SVOWorkOrderDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=False,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SO_WORK_ORDER_DETAIL).get(params)
        return resp.auto_return(key_success='svo_work_order_detail')


class ServiceOrderDetailDeliveryAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SERVICEORDER_CALL.fill_key(pk=pk)).post(data=request.data)
        return resp.auto_return()


class ServiceOrderDiffListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, current_id, comparing_id, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SERVICE_ORDER_DIFF.fill_key(current_id=current_id, comparing_id=comparing_id)).get()
        return resp.auto_return()
