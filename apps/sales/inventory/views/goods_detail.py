from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck


class GoodsDetailList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_detail/goods_detail_list.html',
        menu_active='menu_goods_detail_list',
        breadcrumb='GOODS_DETAIL_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsDetailCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_detail/goods_detail_create.html',
        menu_active='menu_goods_detail_list',
        breadcrumb='GOODS_DETAIL_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsDetailListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_LIST).get(data)
        return resp.auto_return(key_success='goods_detail_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_LIST).post(request.data)
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class GoodsDetailDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_detail/goods_detail_detail.html',
        menu_active='menu_goods_detail_list',
        breadcrumb='GOODS_DETAIL_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_DETAIL_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsDetailUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_detail/goods_detail_update.html',
        menu_active='menu_goods_detail_list',
        breadcrumb='GOODS_DETAIL_UPDATE_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsDetailDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()
