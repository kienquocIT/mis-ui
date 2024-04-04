from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL

from .columns_template import *


def get_config():
    return {
        **COLUMNS_ACCOUNT_USER.data,
        **COLUMNS_HR_GROUPS_LEVEL.data,
        **COLUMNS_HR_GROUPS.data,
        **COLUMNS_HR_ROLES.data,
        **COLUMNS_HR_EMPLOYEE.data,
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


class HrGroupLevelImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_HR_GROUP_LEVEL, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='group_level')


class HrGroupImportAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.IMPORT_HR_GROUP, user=request.user).post(data=request.data)
        return resp.auto_return(key_success='group')
