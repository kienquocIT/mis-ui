from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class ChartOfAccountsList(View):

    @mask_view(
        auth_require=True,
        template='accountingsettings/chart_of_accounts/chart_of_accounts_list.html',
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


class DefaultAccountDeterminationList(View):

    @mask_view(
        auth_require=True,
        template='accountingsettings/default_account_determination/default_account_determination.html',
        breadcrumb='DEFAULT_ACCOUNT_DETERMINATION_LIST_PAGE',
        menu_active='menu_DEFAULT_ACCOUNT_DETERMINATION_LIST',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DefaultAccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DEFAULT_ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='default_account_determination_list')


class DefaultAccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DEFAULT_ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='detail')


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


class InitialBalanceList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='accountingsettings/initial_balance/create.html',
        menu_active='menu_initial_balance',
        breadcrumb='INITIAL_BALANCE_LIST_PAGE',
        icon_cls='fas fa-chart-bar',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class InitialBalanceListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INITIAL_BALANCE_LIST).get(params)
        return resp.auto_return(key_success='initial_balance_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INITIAL_BALANCE_LIST).post(request.data)
        if resp.state:
            # resp.result['message'] = HRMMsg.ABSENCE_EXPLANATION_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()
