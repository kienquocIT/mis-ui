from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

class FixedAssetMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/fixed_asset.html',
        breadcrumb='FIXED_ASSET_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_fixed_asset',
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
