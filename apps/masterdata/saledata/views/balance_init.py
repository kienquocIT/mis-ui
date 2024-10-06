import requests
import xmltodict
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck, SaleMsg


class BalanceInitList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/balance_init.html',
        breadcrumb='BALANCE_INIT_PAGE',
        menu_active='menu_balance_init',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PERIODS_CONFIG_LIST).get()
        for item in resp.result:
            if item['software_start_using_time']:
                return {
                    'data': {'period_setup_sw_start_using_time': item['id']},
                }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class BalanceInitListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BALANCE_INIT_LIST).get(params)
        return resp.auto_return(key_success='balance_init_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BALANCE_INIT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.BALANCE_INIT_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class BalanceInitListAPIImportDB(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BALANCE_INIT_LIST_IMPORT_DB).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.BALANCE_INIT_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class ImportBalanceInitDBAPIViews(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PERIODS_CONFIG_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='periods_detail')
