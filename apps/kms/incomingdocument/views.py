import json

from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _
from django.views import View
from rest_framework import status
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


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
        breadcrumb='INCOMING_DOCUMENT_CREATE',
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
        }
        return ctx, status.HTTP_200_OK


