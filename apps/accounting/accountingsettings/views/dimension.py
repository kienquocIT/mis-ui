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
        resp = ServerAPI(user=request.user, url=ApiURL.DIMENSION_DEFINITION_WITH_VALUES.fill_key(pk=pk)).get()
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
