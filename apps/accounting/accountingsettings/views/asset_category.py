from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

class AssetCategoryList(View):

    @mask_view(
        auth_require=True,
        template='accountingsettings/asset_category/asset_category.html',
        breadcrumb='ASSET_CATEGORY_LIST_PAGE',
        menu_active='menu_asset_category_list',
        icon_cls='fas fa-car',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AssetCategoryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_CATEGORY_LIST).get(params)
        return resp.auto_return(key_success='asset_category_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_CATEGORY_LIST).post(request.data)
        return resp.auto_return()

class AssetCategoryDetailAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_CATEGORY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='asset_category_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_CATEGORY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='asset_category_detail')
