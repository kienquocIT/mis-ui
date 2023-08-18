from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


class AdvancePaymentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_list.html',
        breadcrumb='ADVANCE_PAYMENT_LIST_PAGE',
        menu_active='id_menu_advance_payment',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AdvancePaymentCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_create.html',
        breadcrumb='ADVANCE_PAYMENT_CREATE_PAGE',
        menu_active='menu_advance_payment_list',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST_FOR_CASH_OUTFLOW).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.QUOTATION_LIST_FOR_CASH_OUTFLOW).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        resp6 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp7 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        resp8 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        resp9 = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).get()
        resp10 = ServerAPI(user=request.user, url=ApiURL.PAYMENT_COST_ITEMS_LIST).get()
        return {
                   'data':
                       {
                           'employee_current_id': request.user.employee_current_data.get('id', None),
                           'sale_order_list': resp1.result,
                           'quotation_list': resp2.result,
                           'product_list': resp3.result,
                           'account_list': resp4.result,
                           'advance_payment_list': resp5.result,
                           'opportunity_list': resp6.result,
                           'employee_list': resp7.result,
                           'tax_list': resp8.result,
                           'unit_of_measure': resp9.result,
                           'payment_cost_items_list': resp10.result
                       }
               }, status.HTTP_200_OK


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


class AdvancePaymentDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_detail.html',
        breadcrumb='ADVANCE_PAYMENT_DETAIL_PAGE',
        menu_active='menu_advance_payment_detail',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST_FOR_CASH_OUTFLOW).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.QUOTATION_LIST_FOR_CASH_OUTFLOW).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        resp7 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        resp8 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        resp9 = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).get()
        resp10 = ServerAPI(user=request.user, url=ApiURL.PAYMENT_COST_ITEMS_LIST).get()
        return {
                   'data':
                       {
                           'employee_current_id': request.user.employee_current_data.get('id', None),
                           'sale_order_list': resp1.result,
                           'quotation_list': resp2.result,
                           'product_list': resp3.result,
                           'account_list': resp4.result,
                           'advance_payment_list': resp5.result,
                           'employee_list': resp7.result,
                           'tax_list': resp8.result,
                           'unit_of_measure': resp9.result,
                           'payment_cost_items_list': resp10.result
                       }
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
