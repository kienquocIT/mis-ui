import requests
import xmltodict
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck


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
