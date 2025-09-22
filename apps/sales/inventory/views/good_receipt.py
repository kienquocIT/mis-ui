from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties, PermCheck, BaseView
from apps.shared.msg import GRMsg
from apps.shared.constant import SYSTEM_STATUS


GR_TYPE = (
    (0, GRMsg.TYPE_FOR_PO),
    (1, GRMsg.TYPE_FOR_IA),
    (2, GRMsg.TYPE_FOR_PRODUCT),
    (3, GRMsg.TYPE_FOR_PM),
)


class GoodsReceiptList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_list.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_LIST_PAGE',
        icon_cls='fas fa-dolly-flatbed',
        icon_bg='bg-gold',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS, 'gr_type': GR_TYPE}, status.HTTP_200_OK


class GoodsReceiptCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_create.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_CREATE_PAGE',
        icon_cls='fas fa-dolly-flatbed',
        icon_bg='bg-gold',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsReceiptListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RECEIPT_LIST).get(data)
        return resp.auto_return(key_success='goods_receipt_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.GOODS_RECEIPT_LIST,
        )


class GoodsReceiptDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_detail.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_DETAIL_PAGE',
        icon_cls='fas fa-dolly-flatbed',
        icon_bg='bg-gold',
        perm_check=PermCheck(url=ApiURL.GOODS_RECEIPT_DETAIL_PK, method='GET', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class GoodsReceiptUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_update.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_UPDATE_PAGE',
        icon_cls='fas fa-dolly-flatbed',
        icon_bg='bg-gold',
        perm_check=PermCheck(url=ApiURL.GOODS_RECEIPT_DETAIL_PK, method='PUT', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.INVENTORY_GOODS_RECEIPT
        return {
                   'data': {'doc_id': pk},
                   'input_mapping_properties': input_mapping_properties, 'form_id': 'frm_good_receipt_create'
               }, status.HTTP_200_OK


class GoodsReceiptDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RECEIPT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.GOODS_RECEIPT_DETAIL,
            pk=pk,
        )
