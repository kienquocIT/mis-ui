from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, PermCheck, InputMappingProperties


class AdvancePaymentList(View):

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_list.html',
        breadcrumb='ADVANCE_PAYMENT_LIST_PAGE',
        menu_active='id_menu_advance_payment',
        perm_check=PermCheck(url=ApiURL.ADVANCE_PAYMENT_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AdvancePaymentListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get(params)
        return resp.auto_return(key_success='advance_payment_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.ADVANCE_PAYMENT_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class AdvancePaymentCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_create.html',
        breadcrumb='ADVANCE_PAYMENT_CREATE_PAGE',
        menu_active='menu_advance_payment_list',
        perm_check=PermCheck(url=ApiURL.ADVANCE_PAYMENT_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
                   'data': {'employee_current': resp1.result},
                   'list_from_app': 'cashoutflow.advancepayment.create',
               }, status.HTTP_200_OK


class AdvancePaymentDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_detail.html',
        breadcrumb='ADVANCE_PAYMENT_DETAIL_PAGE',
        menu_active='menu_advance_payment_detail',
        perm_check=PermCheck(url=ApiURL.ADVANCE_PAYMENT_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
                   'data': {'employee_current': resp1.result}
               }, status.HTTP_200_OK


class AdvancePaymentUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_update.html',
        breadcrumb='ADVANCE_PAYMENT_UPDATE_PAGE',
        menu_active='menu_advance_payment_detail',
        perm_check=PermCheck(url=ApiURL.ADVANCE_PAYMENT_DETAIL, method='PUT', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
        resp1 = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_DETAIL.push_id(request.user.employee_current_data.get('id', None))
        ).get()
        return {
            'data': {'employee_current': resp1.result},
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-detail-advance'
        }, status.HTTP_200_OK


class AdvancePaymentDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='advance_payment_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_DETAIL.push_id(pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.ADVANCE_PAYMENT_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class AdvancePaymentCostListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_COST_LIST).get(data)
        return resp.auto_return(key_success='advance_payment_cost_list')
