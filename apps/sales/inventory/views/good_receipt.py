from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class GoodsReceiptList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_list.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsReceiptCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_create.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
