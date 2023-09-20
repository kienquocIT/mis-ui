from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, PermCheck


class PurchaseQuotationRequestList(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_list.html',
        menu_active='id_menu_purchase_quotation_request_list',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationRequestListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).get()
        return resp.auto_return(key_success='purchase_quotation_request_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION_REQUEST
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationRequestCreateFromPR(View):

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_create_from_PR.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_CREATE_PAGE_FROM_PR',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationRequestCreateFromPRAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION_REQUEST
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationRequestCreateManual(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_create_manual.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_CREATE_PAGE_MANUAL',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationRequestCreateManualAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION_REQUEST
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationRequestDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotationrequest/purchase_quotation_request_detail.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_REQUEST_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_REQUEST_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationRequestDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_REQUEST_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='purchase_quotation_request_detail')
