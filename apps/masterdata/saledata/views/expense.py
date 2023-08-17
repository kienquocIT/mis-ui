from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, PermCheck


class ExpenseList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/expense/expense_list.html',
        breadcrumb='EXPENSE_LIST_PAGE',
        menu_active='id_menu_expense_list',
        perm_check=PermCheck(url=ApiURL.EXPENSE_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ExpenseCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/expense/expense_create.html',
        breadcrumb='EXPENSE_CREATE_PAGE',
        menu_active='id_menu_expense_list',
        perm_check=PermCheck(url=ApiURL.EXPENSE_LIST, method='post'),
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
        perm_check=PermCheck(url=ApiURL.EXPENSE_DETAIL, method='GET', fill_key=['pk']),
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
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_LIST).get()
        return resp.auto_return(key_success='expense_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_LIST).post(request.data)
        return resp.auto_return()


class ExpenseDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='expense')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='expense')


# Expense List use for Sale Apps
class ExpenseForSaleListAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_SALE_LIST).get()
        return resp.auto_return(key_success='expense_sale_list')
