import json
from django.utils.translation import gettext_lazy as _
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS


def create_quotation(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_quotation(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class QuotationList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_list.html',
        menu_active='menu_quotation_list',
        breadcrumb='QUOTATION_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class QuotationCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_create.html',
        menu_active='',
        breadcrumb='QUOTATION_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'employee_current': request.user.employee_current_data,
            'input_mapping_properties': InputMappingProperties.QUOTATION_QUOTATION,
            'form_id': 'frm_quotation_create',
            'list_from_app': 'quotation.quotation.create',
            'data': {
                'import_db_form_cfg': {
                    'list_import_db': [
                        {
                            "id": "datable-quotation-create-product-import-db",
                            "name": _("Quotation line detail datatable"),
                            "map_with": 'datable-quotation-create-product',
                            "option": [1],
                            "col_type": [
                                'input-text',
                                'input-text',
                                'textarea',
                                'input-text',
                                'checkbox',
                                'input-text',
                                'input-number',
                                'input-money',
                                'input-number',
                                'input-number'
                            ],
                            "data_format": {
                                "key": "quotation_product_import_data",
                                "value_list": [
                                    {"col_key": "product_code", "col_index": 0},
                                    {"col_key": "product_title", "col_index": 1},
                                    {"col_key": "product_description", "col_index": 2},
                                    {"col_key": "product_category", "col_index": 3},
                                    {"col_key": "is_service", "col_index": 4},
                                    {"col_key": "uom", "col_index": 5},
                                    {"col_key": "quantity", "col_index": 6},
                                    {"col_key": "unit_price", "col_index": 7},
                                    {"col_key": "discount_percent", "col_index": 8},
                                    {"col_key": "tax_percent", "col_index": 9},
                                ]
                            }
                        }
                    ]
                }
            }
        }
        return ctx, status.HTTP_200_OK


class QuotationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_LIST).get(data)
        return resp.auto_return(key_success='quotation_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_quotation(
            request=request,
            url=ApiURL.QUOTATION_LIST,
            msg=SaleMsg.QUOTATION_CREATE
        )


class QuotationDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_detail.html',
        menu_active='menu_quotation_list',
        breadcrumb='QUOTATION_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
                   'employee_current': request.user.employee_current_data,
                   'input_mapping_properties': InputMappingProperties.QUOTATION_QUOTATION,
                   'form_id': 'frm_quotation_create',
               }, status.HTTP_200_OK


class QuotationUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_update.html',
        breadcrumb='QUOTATION_UPDATE_PAGE',
        menu_active='menu_quotation_list',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.QUOTATION_QUOTATION,
            'form_id': 'frm_quotation_create',
            'list_from_app': 'quotation.quotation.edit',
        }
        return ctx, status.HTTP_200_OK


class QuotationDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_quotation(
            request=request,
            url=ApiURL.QUOTATION_DETAIL,
            pk=pk,
            msg=SaleMsg.QUOTATION_UPDATE
        )


class QuotationExpenseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_EXPENSE_LIST).get(data)
        return resp.auto_return(key_success='quotation_expense_list')


# Config
class QuotationConfigDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/quotation/config/quotation_config.html',
        menu_active='menu_quotation_config',
        breadcrumb='SALE_ORDER_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class QuotationConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_CONFIG).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.QUOTATION_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# QUOTATION INDICATOR
class QuotationIndicatorListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = {'application_code': 'quotation'}
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_INDICATOR_LIST).get(data)
        return resp.auto_return(key_success='quotation_indicator_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_quotation(
            request=request,
            url=ApiURL.QUOTATION_INDICATOR_LIST,
            msg=SaleMsg.QUOTATION_INDICATOR_CREATE
        )


class QuotationIndicatorDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_INDICATOR_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_quotation(
            request=request,
            url=ApiURL.QUOTATION_INDICATOR_DETAIL,
            pk=pk,
            msg=SaleMsg.QUOTATION_INDICATOR_UPDATE
        )


class QuotationIndicatorRestoreAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_quotation(
            request=request,
            url=ApiURL.QUOTATION_INDICATOR_RESTORE,
            pk=pk,
            msg=SaleMsg.QUOTATION_INDICATOR_RESTORE
        )
