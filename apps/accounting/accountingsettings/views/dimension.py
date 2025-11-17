from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

class DimensionDefinitionList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/dimension_definition/dimension_definition_list.html',
        breadcrumb='DIMENSION_DEFINITION_LIST_PAGE',
        menu_active='menu_dimension_definition_list',
        icon_cls='fa fa-pen-ruler',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DimensionDefinitionListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_DEFINITION_LIST).get(params)
        return resp.auto_return(key_success='dimension_definition_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_DEFINITION_LIST).post(request.data)
        return resp.auto_return()


class DimensionDefinitionDetailAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_DEFINITION_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='dimension_definition')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_DEFINITION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='dimension_definition')


class DimensionValueList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/dimension_value/dimension_value_list.html',
        breadcrumb='DIMENSION_VALUE_LIST_PAGE',
        menu_active='menu_dimension_value_list',
        icon_cls='fa fa-table',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DimensionDefinitionWithValueAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_DEFINITION_WITH_VALUES.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='dimension_definition_with_values')


class DimensionValueListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_VALUE_LIST).get(params)
        return resp.auto_return(key_success='dimension_value_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_VALUE_LIST).post(request.data)
        return resp.auto_return()


class DimensionValueDetailAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_VALUE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='dimension_value')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_VALUE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='dimension_value')


class DimensionSyncConfigList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/dimension_sync_config/dimension_sync_config.html',
        breadcrumb='DIMENSION_VALUE_LIST_PAGE',
        menu_active='menu_dimension_sync_config_list',
        icon_cls='fa fa-table',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DimensionSyncConfigListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SYNC_CONFIG_LIST).get(params)
        return resp.auto_return(key_success='dimension_sync_config_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SYNC_CONFIG_LIST).post(request.data)
        return resp.auto_return()


class DimensionSyncConfigDetailAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SYNC_CONFIG_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='dimension_sync_config_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SYNC_CONFIG_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='dimension_sync_config_detail')


class DimensionSyncConfigApplicationListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SYNC_CONFIG_APPLICATION_LIST).get(params)
        return resp.auto_return(key_success='dimension_sync_config_app_list')


class DimensionListForAccountingAccountAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_LIST_FOR_ACCOUNTING_ACCOUNT.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='dimension_list_for_accounting_account')


class DimensionAccountList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/dimension_account/dimension_account.html',
        breadcrumb='DIMENSION_ACCOUNT_MAP_LIST_PAGE',
        menu_active='menu_dimension_account_list',
        icon_cls='fa fa-table',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

class DimensionAccountListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_ACCOUNT_MAP_LIST).post(request.data)
        return resp.auto_return()


class DimensionAccountDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_ACCOUNT_MAP_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='dimension_account_detail')


class DimensionSplitTemplateList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/dimension_split_template/dimension_split_template_list.html',
        breadcrumb='DIMENSION_VALUE_LIST_PAGE',
        menu_active='menu_dimension_split_template_list',
        icon_cls='fa fa-table',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

class DimensionSplitTemplateListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SPLIT_TEMPLATE_LIST).get(params)
        return resp.auto_return(key_success='dimension_split_template_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SPLIT_TEMPLATE_LIST).post(request.data)
        return resp.auto_return()


class DimensionSplitTemplateDetailAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SPLIT_TEMPLATE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='dimension_split_template')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_SPLIT_TEMPLATE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='dimension_split_template')
