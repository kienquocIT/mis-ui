from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


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
                    'data': {
                        'period_setup_sw_start_using_time': item['id'],
                        'import_db_form_cfg': {
                            'list_import_db': [
                                {
                                    "id": "table-balance-item-import-db",
                                    "map_with": "table-balance-item",
                                    "name": _("Balance init datatable"),
                                    "option": [0],
                                    "col_type": [
                                        'input-text',
                                        'input-text',
                                        'input-text',
                                        'input-money'
                                    ],
                                    "data_format": {
                                        "key": "balance_data",
                                        "value_list": [
                                            {"col_key": "product_code", "col_index": 0},
                                            {"col_key": "warehouse_code", "col_index": 1},
                                            {"col_key": "quantity", "col_index": 2},
                                            {"col_key": "value", "col_index": 3},
                                            {"col_key": "data_sn", "col_index": -1, "data_default": []},
                                            {"col_key": "data_lot", "col_index": -1, "data_default": []},
                                        ]
                                    }
                                }
                            ]
                        }
                    },
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


class BalanceInitializationListImportDBAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BALANCE_INIT_IMPORT_DB).post(request.data)
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
