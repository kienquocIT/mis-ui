import json

from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties, BaseView
from apps.shared.constant import SYSTEM_STATUS


class QuotationList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_list.html',
        menu_active='menu_quotation_list',
        breadcrumb='QUOTATION_LIST_PAGE',
        icon_cls='fa-solid fa-tag',
        icon_bg='bg-violet',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class QuotationCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_create.html',
        menu_active='',
        breadcrumb='QUOTATION_CREATE_PAGE',
        icon_cls='fa-solid fa-tag',
        icon_bg='bg-violet',
    )
    def get(self, request, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        ctx = {
            'employee_current': employee_current,
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
            },
            'app_id': 'b9650500-aba7-44e3-b6e0-2542622702a3',
        }
        return ctx, status.HTTP_200_OK


class QuotationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return BaseView.run_list(
            request=request,
            url=ApiURL.QUOTATION_LIST,
            key_success='quotation_list'
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.QUOTATION_LIST,
        )


class QuotationDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_detail.html',
        menu_active='menu_quotation_list',
        breadcrumb='QUOTATION_DETAIL_PAGE',
        icon_cls='fa-solid fa-tag',
        icon_bg='bg-violet',
    )
    def get(self, request, pk, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if resp.state:
            task_config = resp.result
        return {
                   'data': {'doc_id': pk},
                   'employee_current': employee_current,
                   'input_mapping_properties': InputMappingProperties.QUOTATION_QUOTATION,
                   'form_id': 'frm_quotation_create',

                   'task_config': task_config,
                   'employee_info': request.user.employee_current_data,
               }, status.HTTP_200_OK


class QuotationUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/quotation/quotation_update.html',
        breadcrumb='QUOTATION_UPDATE_PAGE',
        menu_active='menu_quotation_list',
        icon_cls='fa-solid fa-tag',
        icon_bg='bg-violet',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.QUOTATION_QUOTATION,
            'form_id': 'frm_quotation_create',
            'list_from_app': 'quotation.quotation.edit',
            'app_id': 'b9650500-aba7-44e3-b6e0-2542622702a3',
        }
        return ctx, status.HTTP_200_OK


class QuotationDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.QUOTATION_DETAIL,
            pk=pk,
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, *args, pk, **kwargs):
        return BaseView.run_delete(
            request=request,
            url=ApiURL.QUOTATION_DETAIL,
            pk=pk,
        )


# PRINT VIEW
class QuotationDetailPrintAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_DETAIL_PRINT.fill_key(pk=pk)).get()
        return resp.auto_return()


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
        return BaseView.run_create(
            request=request,
            url=ApiURL.QUOTATION_INDICATOR_LIST,
        )


class QuotationIndicatorDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_INDICATOR_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.QUOTATION_INDICATOR_DETAIL,
            pk=pk,
        )


class QuotationIndicatorRestoreAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.QUOTATION_INDICATOR_RESTORE,
            pk=pk,
        )
