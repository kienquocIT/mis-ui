import datetime
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, PermCheck

__all__ = ['GoodReceiptList', 'GoodReceiptListAPI', 'GoodReceiptCreate', 'GoodReceiptDetail', 'GoodReceiptDetailAPI',
           'GoodReceiptEdit']

from apps.shared.msg.sale import GRMsg


class GoodReceiptList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/good_receipt/list.html',
        breadcrumb='GOOD_RECEIPT_LIST_PAGE',
        menu_active='menu_good_receipt_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodReceiptListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOOD_RECEIPT_API).get()
        return resp.auto_return(key_success='good_receipt_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOOD_RECEIPT_API).post(request.data)
        if resp.state:
            resp.result['message'] = GRMsg.MS_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class GoodReceiptCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/good_receipt/create.html',
        breadcrumb='GOOD_RECEIPT_CREATE_PAGE',
        menu_active='menu_good_receipt_list',
        perm_check=PermCheck(url=ApiURL.GOOD_RECEIPT_API, method='post'),
    )
    def get(self, request, *args, **kwargs):
        date_created = datetime.datetime.now().strftime("%d/%m/%Y")
        return {'date_created': date_created}, status.HTTP_200_OK


class GoodReceiptDetail(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/good_receipt/detail.html',
        breadcrumb='GOOD_RECEIPT_DETAIL_PAGE',
        menu_active='menu_good_receipt_list',
    )
    def get(self, request, pk, *args, **kwargs):
        date_created = datetime.datetime.now().strftime("%d/%m/%Y")
        return {'date_created': date_created, 'doc_id': pk}, status.HTTP_200_OK


class GoodReceiptEdit(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/good_receipt/edit.html',
        breadcrumb='GOOD_RECEIPT_EDIT_PAGE',
        menu_active='menu_good_receipt_list',
    )
    def get(self, request, pk, *args, **kwargs):
        date_created = datetime.datetime.now().strftime("%d/%m/%Y")
        return {'date_created': date_created, 'doc_id': pk}, status.HTTP_200_OK


class GoodReceiptDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOOD_RECEIPT_API.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOOD_RECEIPT_API.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = GRMsg.MS_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOOD_RECEIPT_API.push_id(pk)).delete(request.data)
        if resp.state:
            resp.result['detail'] = GRMsg.MS_DELETE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

