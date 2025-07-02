from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, BaseView
from apps.shared.constant import SYSTEM_STATUS


class GoodsRecoveryList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodsrecovery/goods_recovery_list.html',
        menu_active='menu_goods_recovery_list',
        breadcrumb='GOODS_RECOVERY_LIST_PAGE',
        icon_cls='fas fa-reply',
        icon_bg='bg-lime',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class GoodsRecoveryCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodsrecovery/goods_recovery_create.html',
        menu_active='menu_goods_recovery_list',
        breadcrumb='GOODS_RECOVERY_CREATE_PAGE',
        icon_cls='fas fa-reply',
        icon_bg='bg-lime',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsRecoveryListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RECOVERY_LIST).get(data)
        return resp.auto_return(key_success='goods_recovery_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.GOODS_RECOVERY_LIST,
        )


class GoodsRecoveryDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodsrecovery/goods_recovery_detail.html',
        menu_active='menu_goods_recovery_list',
        breadcrumb='GOODS_RECOVERY_DETAIL_PAGE',
        icon_cls='fas fa-reply',
        icon_bg='bg-lime',
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsRecoveryUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodsrecovery/goods_recovery_update.html',
        menu_active='menu_goods_recovery_list',
        breadcrumb='GOODS_RECOVERY_UPDATE_PAGE',
        icon_cls='fas fa-reply',
        icon_bg='bg-lime',
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsRecoveryDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RECOVERY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.GOODS_RECOVERY_DETAIL,
            pk=pk,
        )


class GoodsRecoveryLeaseGenerateListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RECOVERY_LEASE_GENERATE_LIST).get(data)
        return resp.auto_return(key_success='recovery_lease_generate_list')
