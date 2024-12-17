from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck, SaleMsg


class GoodsDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_detail/goods_detail.html',
        menu_active='menu_goods_detail_list',
        breadcrumb='GOODS_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {
            'data': {
                'import_db_form_cfg': {
                    'list_import_db': [
                        {
                            "id": "table-serial-import-db",
                            "name": _("Serial datatable"),
                            "map_with": 'table-serial',
                            "option": [0],
                            "col_type": [
                                'input-text',
                                'input-text',
                                'input-date',
                                'input-date',
                                'input-date',
                                'input-date',
                            ],
                            "data_format": {
                                "key": "data",
                                "value_list": [
                                    {"col_key": "vendor_serial_number", "col_index": 0},
                                    {"col_key": "serial_number", "col_index": 1},
                                    {"col_key": "expire_date", "col_index": 2},
                                    {"col_key": "manufacture_date", "col_index": 3},
                                    {"col_key": "warranty_start", "col_index": 4},
                                    {"col_key": "warranty_end", "col_index": 5},
                                    {"col_key": "product_id", "col_index": -2, "ele_id": '#table-serial', "get_value": False, "get_text": False, "get_attr": "data-product-id"},
                                    {"col_key": "goods_receipt_id", "col_index": -2, "ele_id": '#table-serial', "get_value": False, "get_text": False, "get_attr": "data-goods-receipt-id"},
                                    {"col_key": "warehouse_id", "col_index": -2, "ele_id": '#table-serial', "get_value": False, "get_text": False, "get_attr": "data-warehouse-id"},
                                    {"col_key": "purchase_request_id", "col_index": -2, "ele_id": '#table-serial', "get_value": False, "get_text": False, "get_attr": "data-purchase-request-id"},
                                ]
                            }
                        }
                    ]
                }
            },
        }, status.HTTP_200_OK


class GoodsDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_LIST).get(data)
        return resp.auto_return(key_success='goods_detail_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CREATE_UPDATE_GOODS_DETAIL_DATA).post(request.data)
        resp.result['message'] = SaleMsg.GOODS_DETAIL_UPDATE
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class GoodsDetailSerialDataAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_SERIAL_DATA_LIST).get(data)
        return resp.auto_return(key_success='goods_detail_sn_data_list')


class GoodsDetailListImportDBAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_IMPORT_DB).post(request.data)
        resp.result['message'] = SaleMsg.GOODS_DETAIL_UPDATE
        return resp.auto_return(status_success=status.HTTP_201_CREATED)
