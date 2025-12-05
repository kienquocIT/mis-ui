from django.views import View
from rest_framework import status

from apps.core.fimport.columns_template.crm.saledata.account import COLUMNS_SALEDATA_ACCOUNT
from apps.core.fimport.columns_template.crm.saledata.config import COLUMNS_SALEDATA_PAYMENT_TERM
from apps.core.fimport.columns_template.crm.saledata.price import COLUMNS_SALEDATA_PRICE_TAX_CATEGORY, \
    COLUMNS_SALEDATA_PRICE_TAX
from apps.core.fimport.columns_template.crm.saledata.product import COLUMNS_SALEDATA_PRODUCT_UOM, \
    COLUMNS_SALEDATA_PRODUCT, COLUMNS_SALEDATA_PRODUCT_MANUFACTURER
from apps.shared import mask_view
from apps.core.fimport.columns_template import (
    COLUMNS_ACCOUNT_USER, COLUMNS_HR_GROUPS_LEVEL, COLUMNS_HR_GROUPS,
    COLUMNS_HR_ROLES, COLUMNS_HR_EMPLOYEE,
    COLUMNS_SALEDATA_CONTACT, COLUMNS_SALEDATA_SALUTATION,
    COLUMNS_SALEDATA_CURRENCY,
    COLUMNS_SALEDATA_ACCOUNT_GROUP, COLUMNS_SALEDATA_ACCOUNT_TYPE, COLUMNS_SALEDATA_INDUSTRY,
    COLUMNS_SALEDATA_PRODUCT_UOMGROUP,
    COLUMNS_SALEDATA_PRODUCT_PRODUCT_TYPE,
    COLUMNS_SALEDATA_PRODUCT_PRODUCT_CATEGORY, COLUMNS_HR_SHIFT,
)


def get_config():
    return {
        **COLUMNS_ACCOUNT_USER.data,
        **COLUMNS_HR_GROUPS_LEVEL.data,
        **COLUMNS_HR_GROUPS.data,
        **COLUMNS_HR_ROLES.data,
        **COLUMNS_HR_EMPLOYEE.data,
        **COLUMNS_SALEDATA_SALUTATION.data,
        **COLUMNS_SALEDATA_CONTACT.data,
        **COLUMNS_SALEDATA_CURRENCY.data,
        **COLUMNS_SALEDATA_ACCOUNT_GROUP.data,
        **COLUMNS_SALEDATA_ACCOUNT_TYPE.data,
        **COLUMNS_SALEDATA_INDUSTRY.data,
        **COLUMNS_SALEDATA_PAYMENT_TERM.data,
        **COLUMNS_SALEDATA_ACCOUNT.data,
        **COLUMNS_SALEDATA_PRODUCT_UOMGROUP.data,
        **COLUMNS_SALEDATA_PRODUCT_PRODUCT_TYPE.data,
        **COLUMNS_SALEDATA_PRODUCT_PRODUCT_CATEGORY.data,
        **COLUMNS_SALEDATA_PRODUCT_MANUFACTURER.data,
        **COLUMNS_SALEDATA_PRODUCT_UOM.data,
        **COLUMNS_SALEDATA_PRICE_TAX_CATEGORY.data,
        **COLUMNS_SALEDATA_PRICE_TAX.data,
        **COLUMNS_SALEDATA_PRODUCT.data,
        **COLUMNS_HR_SHIFT.data
    }


class FImportListView(View):
    @mask_view(
        auth_require=True,
        template='fimport/list.html',
        jsi18n='fimport',
        breadcrumb='IMPORT_LIST_PAGE',
        menu_active='menu_import_data',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FImportCreateView(View):

    @classmethod
    def filter_enable_import(cls, data):
        result = {}
        for key, value in data.items():
            if (
                    value['url'] and value['url'] != '#'
                    and value['template_link'] and value['template_link'] != '#'
                    and value['columns'] and value['sheet_name']
            ):
                result[key] = value
        return result

    @mask_view(
        auth_require=True,
        template='fimport/index.html',
        jsi18n='fimport',
        breadcrumb='IMPORT_CREATE_PAGE',
        menu_active='menu_import_data',
    )
    def get(self, request, *args, **kwargs):
        ctx = get_config()
        return self.filter_enable_import(ctx), status.HTTP_200_OK
