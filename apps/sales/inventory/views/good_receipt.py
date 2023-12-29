from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties, PermCheck
from apps.shared.msg import BaseMsg


SYSTEM_STATUS = (
    (0, BaseMsg.DRAFT),
    (1, BaseMsg.CREATED),
    (2, BaseMsg.ADDED),
    (3, BaseMsg.FINISH),
    (4, BaseMsg.CANCEL),
)


def create_goods_receipt(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_goods_receipt(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class GoodsReceiptList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_list.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class GoodsReceiptCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_create.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_CREATE_PAGE',
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
        return create_goods_receipt(
            request=request,
            url=ApiURL.GOODS_RECEIPT_LIST,
            msg=SaleMsg.GOODS_RECEIPT_CREATE
        )


class GoodsReceiptDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goodreceipt/goods_receipt_detail.html',
        menu_active='menu_goods_receipt_list',
        breadcrumb='GOODS_RECEIPT_DETAIL_PAGE',
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
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RECEIPT_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_goods_receipt(
            request=request,
            url=ApiURL.GOODS_RECEIPT_DETAIL,
            pk=pk,
            msg=SaleMsg.GOODS_RECEIPT_UPDATE
        )
