from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck


class GoodsTransferList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/list.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_TRANSFER_LIST, method='get'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsTransferCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/create.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_TRANSFER_LIST, method='post'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsTransferDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_transfer/detail.html',
        menu_active='menu_goods_transfer_list',
        breadcrumb='GOODS_TRANSFER_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_TRANSFER_DETAIL, method='get', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsTransferListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_TRANSFER_LIST).get(data)
        return resp.auto_return(key_success='goods_transfer_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_TRANSFER_LIST).post(request.data)
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class GoodsTransferDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOODS_TRANSFER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='goods_transfer_detail')
