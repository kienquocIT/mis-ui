from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class ExpenseList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/expense/expense_list.html',
        breadcrumb='EXPENSE_LIST_PAGE',
        menu_active='id_menu_expense_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ExpenseCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/expense/expense_create.html',
        breadcrumb='EXPENSE_CREATE_PAGE',
        menu_active='id_menu_expense_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST).get()
        resp_currency = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get()
        if resp.state and resp_currency:
            return {'content': {'price_list': resp.result, 'currency_list': resp_currency.result}}, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ExpenseDetail(View):
    @mask_view( # noqa
        auth_require=True,
        template='masterdata/saledata/expense/expense_detail.html',
        breadcrumb='EXPENSE_DETAIL_PAGE',
        menu_active='menu_account_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRICE_LIST).get() # noqa
        resp_currency = ServerAPI(user=request.user, url=ApiURL.CURRENCY_LIST).get()
        if resp.state and resp_currency:
            return {'content': {'price_list': resp.result, 'currency_list': resp_currency.result}}, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ExpenseListAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_LIST).get() # noqa
        if resp.state:
            return {'expense_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data # noqa
        response = ServerAPI(user=request.user, url=ApiURL.EXPENSE_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class ExpenseDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_DETAIL.fill_key(expense_id=pk)).get() # noqa
        if resp.state:
            return {'expense': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_DETAIL.fill_key(expense_id=pk)).put(request.data)
        if resp.state:
            return {'expense': resp.result}, status.HTTP_200_OK
        if resp.errors:
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
