from django.views import View
from rest_framework import status

from apps.shared import mask_view

from .columns_template import *


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
    @mask_view(
        auth_require=True,
        template='fimport/index.html',
        jsi18n='fimport',
        breadcrumb='IMPORT_CREATE_PAGE',
        menu_active='menu_import_data',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            **COLUMNS_ACCOUNT_USER,
        }
        return ctx, status.HTTP_200_OK
