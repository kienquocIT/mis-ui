from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, PermCheck, InputMappingProperties


class ARInvoiceList(View):

    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_list.html',
        breadcrumb='AR_INVOICE_LIST_PAGE',
        menu_active='id_menu_ar_invoice',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ARInvoiceListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_LIST).get(params)
        return resp.auto_return(key_success='ar_invoice_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.AR_INVOICE_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class ARInvoiceCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_create.html',
        breadcrumb='AR_INVOICE_CREATE_PAGE',
        menu_active='menu_ar_invoice_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ARInvoiceDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_detail.html',
        breadcrumb='AR_INVOICE_DETAIL_PAGE',
        menu_active='menu_ar_invoice_detail',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ARInvoiceUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_update.html',
        breadcrumb='AR_INVOICE_UPDATE_PAGE',
        menu_active='menu_ar_invoice_detail',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ARInvoiceDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='ar_invoice_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.AR_INVOICE_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class DeliveryListForARInvoiceAPI(APIView):

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LIST_AR_INVOICE).get(params)
        return resp.auto_return(key_success='delivery_list')
