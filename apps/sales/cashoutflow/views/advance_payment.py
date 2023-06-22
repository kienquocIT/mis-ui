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
        resp1 = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.QUOTATION_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.EXPENSE_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        resp6 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp7 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        resp8 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        return {'data':
            {
                'employee_current_id': request.user.employee_current_data.get('id', None),
                'sale_order_list': resp1.result,
                'quotation_list': resp2.result,
                'expense_list': resp3.result,
                'account_list': resp4.result,
                'advance_payment_list': resp5.result,
                'opportunity_list': resp6.result,
                'employee_list': resp7.result,
                'tax_list': resp8.result
            }
        }, status.HTTP_200_OK


class AdvancePaymentListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        if resp.state:
            return {'advance_payment_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).post(data)
        if response.state:
            response.result['message'] = SaleMsg.ADVANCE_PAYMENT_CREATE
            return response.result, status.HTTP_201_CREATED
        elif response.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': response.errors}, status.HTTP_400_BAD_REQUEST


class AdvancePaymentDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='advancepayment/advance_payment_detail.html',
        breadcrumb='ADVANCE_PAYMENT_DETAIL_PAGE',
        menu_active='menu_advance_payment_detail',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST).get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.QUOTATION_LIST).get()
        resp3 = ServerAPI(user=request.user, url=ApiURL.EXPENSE_LIST).get()
        resp4 = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_LIST).get()
        resp5 = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        resp6 = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_LIST).get()
        resp7 = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).get()
        resp8 = ServerAPI(user=request.user, url=ApiURL.TAX_LIST).get()
        return {'data':
            {
                'employee_current_id': request.user.employee_current_data.get('id', None),
                'sale_order_list': resp1.result,
                'quotation_list': resp2.result,
                'expense_list': resp3.result,
                'account_list': resp4.result,
                'advance_payment_list': resp5.result,
                'opportunity_list': resp6.result,
                'employee_list': resp7.result,
                'tax_list': resp8.result
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
        if resp.state:
            return {'advance_payment_detail': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_DETAIL.push_id(pk)).put(data)
        if response.state:
            response.result['message'] = SaleMsg.ADVANCE_PAYMENT_UPDATE
            return response.result, status.HTTP_200_OK
        elif response.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': response.errors}, status.HTTP_400_BAD_REQUEST
