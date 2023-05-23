import datetime
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

__all__ = ['GoodReceiptList', 'GoodReceiptListAPI', 'GoodReceiptCreate', 'GoodReceiptDetail', 'GoodReceiptDetailAPI']

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
        resp = ServerAPI(user=request.user, url=ApiURL.GOOD_RECEIPT_API).get()
        if resp.state:
            return {'good_receipt_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.GOOD_RECEIPT_API).post(request.data)
        if response.state:
            response.result['message'] = GRMsg.MS_CREATE
            return response.result, status.HTTP_201_CREATED
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class GoodReceiptCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/good_receipt/create.html',
        breadcrumb='GOOD_RECEIPT_CREATE_PAGE',
        menu_active='menu_good_receipt_list',
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


class GoodReceiptDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOOD_RECEIPT_API.push_id(pk)).get()
        if resp.state:
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        req = ServerAPI(user=request.user, url=ApiURL.GOOD_RECEIPT_API.push_id(pk)).put(request.data)
        if req.state:
            req.result['message'] = GRMsg.MS_UPDATE
            return req.result, status.HTTP_200_OK
        elif req.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': req.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        req = ServerAPI(user=request.user, url=ApiURL.GOOD_RECEIPT_API.push_id(pk)).delete(request.data)
        if req.state:
            req.result['detail'] = GRMsg.MS_DELETE
            return req.result, status.HTTP_200_OK
        elif req.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': req.errors}, status.HTTP_400_BAD_REQUEST
