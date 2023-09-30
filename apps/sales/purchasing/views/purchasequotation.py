from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, PermCheck


class PurchaseQuotationList(View):

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotation/purchase_quotation_list.html',
        menu_active='id_menu_purchase_quotation_list',
        breadcrumb='PURCHASE_QUOTATION_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_LIST).get(data)
        return resp.auto_return(key_success='purchase_quotation_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationCreate(View):

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotation/purchase_quotation_create.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationCreateAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PURCHASE_QUOTATION
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseQuotationDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchasequotation/purchase_quotation_detail.html',
        menu_active='',
        breadcrumb='PURCHASE_QUOTATION_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_QUOTATION_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseQuotationDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_QUOTATION_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='purchase_quotation_detail')


class PurchaseQuotationProductListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_QUOTATION_PRODUCT_LIST).get(data)
        return resp.auto_return(key_success='purchase_quotation_product_list')
