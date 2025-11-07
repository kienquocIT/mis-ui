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
