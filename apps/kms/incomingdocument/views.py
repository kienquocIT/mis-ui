import json

from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties, SECURITY_LV, SYSTEM_STATUS


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


class IncomingDocumentCreate(View):
    @mask_view(
        auth_require=True,
        template='kms/incomingdocument/create.html',
        menu_active='menu_incoming_document',
        breadcrumb='INCOMING_DOCUMENT_CREATE_PAGE',
        icon_cls='fas fa-file-invoice-dollar',
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
            'lst_lv': SECURITY_LV,

        }
        return ctx, status.HTTP_200_OK


class IncomingDocumentList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/incomingdocument/list.html',
        menu_active='',
        breadcrumb='INCOMING_DOCUMENT_LIST'
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class IncomingDocumentListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INCOMING_DOCUMENT_LIST).get(params)
        return resp.auto_return(key_success='incoming_document_list')


class IncomingDocumentDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/incomingdocument/detail.html',
        menu_active='',
        breadcrumb='INCOMING_DOCUMENT_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk, 'lst_lv': SECURITY_LV}, status.HTTP_200_OK


class IncomingDocumentDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INCOMING_DOCUMENT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()


class IncomingDocumentEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/incomingdocument/edit.html',
        menu_active='',
        breadcrumb='INCOMING_DOCUMENT_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.INCOMING_DOCUMENT_DATA_MAP
        return {
           'pk': pk,
           'input_mapping_properties': input_mapping_properties,
           'form_id': 'frm_document_approval',
           'lst_lv': SECURITY_LV
        }, status.HTTP_200_OK

