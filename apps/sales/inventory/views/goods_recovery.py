from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties, PermCheck
from apps.shared.msg import GRMsg
from apps.shared.constant import SYSTEM_STATUS


def create_goods_recovery(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_goods_recovery(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class GoodsRecoveryList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodsrecovery/goods_recovery_list.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class GoodsRecoveryCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodsrecovery/goods_recovery_create.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
