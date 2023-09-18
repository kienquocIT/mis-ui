from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, PermCheck


class ExpenseItemList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/expense_item/list.html',
        breadcrumb='EXPENSE_ITEM_LIST_PAGE',
        menu_active='id_menu_expense_item_list',
        perm_check=PermCheck(url=ApiURL.EXPENSE_ITEM_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ExpenseItemListAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_ITEM_LIST).get()
        return resp.auto_return(key_success='expense_item_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_ITEM_LIST).post(request.data)
        return resp.auto_return()


class ExpenseItemDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_ITEM_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='expense_item')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EXPENSE_ITEM_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='expense_item')
