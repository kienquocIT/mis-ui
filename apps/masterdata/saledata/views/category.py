from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

class CategoryMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/category.html',
        breadcrumb='CATEGORY_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_categories',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FixedAssetClassificationGroupMasterDataListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_CLASSIFICATION_GROUP_LIST).get(params)
        return resp.auto_return(key_success='classification_group_list')

class FixedAssetClassificationMasterDataListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_CLASSIFICATION_LIST).get(params)
        return resp.auto_return(key_success='classification_list')


class ToolClassificationMasterDataListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_CLASSIFICATION_LIST).get(params)
        return resp.auto_return(key_success='tool_classification_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_CLASSIFICATION_LIST).post(request.data)
        return resp.auto_return(key_success='tool_classification_list')

class ToolClassificationMasterDateDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_CLASSIFICATION_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='tool_classification')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INSTRUMENT_TOOL_CLASSIFICATION_DETAIL.push_id(pk)).put(request.data)
        return resp.auto_return(key_success='tool_classification')