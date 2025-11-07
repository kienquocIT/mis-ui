from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class ChartOfAccountsList(View):

    @mask_view(
        auth_require=True,
        template='accountingsettings/chart_of_account/chart_of_account_list.html',
        breadcrumb='CHART_OF_ACCOUNTS_LIST_PAGE',
        menu_active='menu_chart_of_accounts_list',
        icon_cls='fas fa-list-alt',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ChartOfAccountsListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CHART_OF_ACCOUNTS_LIST).get(params)
        return resp.auto_return(key_success='chart_of_accounts_list')

    # @mask_view(
    #     auth_require=True,
    #     is_api=True,
    # )
    # def post(self, request, *arg, **kwargs):
    #     resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).post(request.data)
    #     if resp.state:
    #         resp.result['message'] = SaleMsg.ADVANCE_PAYMENT_CREATE
    #         return resp.result, status.HTTP_201_CREATED
    #     return resp.auto_return()


class AccountDeterminationList(View):

    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/account_determination.html',
        breadcrumb='ACCOUNT_DETERMINATION_LIST_PAGE',
        menu_active='menu_account_determination_list',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='account_determination_list')


class AccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='account_determination_detail')


class WarehouseAccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='warehouse_account_determination_list')


class WarehouseAccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='detail')


class ProductTypeAccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='product_type_account_determination_list')


class ProductTypeAccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='detail')


class ProductAccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='product_account_determination_list')


class ProductAccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='detail')
