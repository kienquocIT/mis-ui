from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, PermCheck, InputMappingProperties
from django.utils.translation import gettext_lazy as _


class PaymentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='payment/payment_list.html',
        breadcrumb='PAYMENT_LIST_PAGE',
        menu_active='id_menu_payment',
        perm_check=PermCheck(url=ApiURL.PAYMENT_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PaymentCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='payment/payment_create.html',
        breadcrumb='PAYMENT_CREATE_PAGE',
        menu_active='menu_advance_payment_list',
        perm_check=PermCheck(url=ApiURL.PAYMENT_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
                   'data': {'employee_current': resp1.result},
                   'list_from_app': 'cashoutflow.payment.create',
               }, status.HTTP_200_OK


class PaymentListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_LIST).get(params)
        return resp.auto_return(key_success='payment_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PAYMENT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PaymentDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='payment/payment_detail.html',
        breadcrumb='PAYMENT_DETAIL_PAGE',
        menu_active='menu_payment_detail',
        perm_check=PermCheck(url=ApiURL.PAYMENT_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
                   'data': {'employee_current': resp1.result}
               }, status.HTTP_200_OK


class PaymentUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='payment/payment_update.html',
        breadcrumb='PAYMENT_DETAIL_PAGE',
        menu_active='menu_payment_detail',
        perm_check=PermCheck(url=ApiURL.PAYMENT_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.CASHOUTFLOW_PAYMENT
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
            'data': {'employee_current': resp1.result},
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-detail-payment'
        }, status.HTTP_200_OK


class PaymentDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='payment_detail')


class PaymentCostItemsListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_COST_ITEMS_LIST).get(data)
        return resp.auto_return(key_success='payment_cost_items_list')


class PaymentConfigList(View):
    @mask_view(
        auth_require=True,
        template='payment/payment_config.html',
        menu_active='menu_payment_config',
        breadcrumb='PAYMENT_CONFIG_PAGE',
        perm_check=PermCheck(url=ApiURL.PAYMENT_CONFIG_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PaymentConfigListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_CONFIG_LIST).get()
        return resp.auto_return(key_success='payment_config_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_CONFIG_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PAYMENT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PaymentCostListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_COST_LIST).get(data)
        return resp.auto_return(key_success='payment_cost_list')
