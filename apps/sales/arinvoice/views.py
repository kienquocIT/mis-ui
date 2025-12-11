import hashlib
import uuid
import time
import base64
import requests
import json
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


class ARInvoiceList(View):
    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_list.html',
        breadcrumb='AR_INVOICE_LIST_PAGE',
        menu_active='id_menu_ar_invoice',
        icon_cls='fas fa-file-invoice',
        icon_bg='bg-primary',
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
        icon_cls='fas fa-file-invoice',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVOICE_SIGN_LIST).get()
        return {
            'invoice_signs': resp.result[0] if len(resp.result) > 0 else '',
            'form_id': 'form-create-ar-invoice',
        }, status.HTTP_200_OK


class ARInvoiceDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_detail.html',
        breadcrumb='AR_INVOICE_DETAIL_PAGE',
        menu_active='menu_ar_invoice_detail',
        icon_cls='fas fa-file-invoice',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVOICE_SIGN_LIST).get()
        return {
            'invoice_signs': resp.result[0] if len(resp.result) > 0 else ''
        }, status.HTTP_200_OK


class ARInvoiceUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='arinvoice/ar_invoice_update.html',
        breadcrumb='AR_INVOICE_UPDATE_PAGE',
        menu_active='menu_ar_invoice_detail',
        icon_cls='fas fa-file-invoice',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVOICE_SIGN_LIST).get()
        return {
            'invoice_signs': resp.result[0] if len(resp.result) > 0 else '',
            'form_id': 'form-detail-ar-invoice',
        }, status.HTTP_200_OK


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


class SaleOrderListForARInvoiceAPI(APIView):

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SO_LIST_AR_INVOICE).get(params)
        return resp.auto_return(key_success='sale_order_list')


class LeaseOrderListForARInvoiceAPI(APIView):

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LO_LIST_AR_INVOICE).get(params)
        return resp.auto_return(key_success='lease_order_list')


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


def generate_token(http_method, username, password):
    epoch_start = 0
    timestamp = str(int(time.time() - epoch_start))
    nonce = uuid.uuid4().hex
    signature_raw_data = http_method.upper() + timestamp + nonce

    md5 = hashlib.md5()
    md5.update(signature_raw_data.encode('utf-8'))
    signature = base64.b64encode(md5.digest()).decode('utf-8')

    return f"{signature}:{nonce}:{timestamp}:{username}:{password}"


class EZInvoiceDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='arinvoice/detail_ez_invoice.html',
        breadcrumb='',
        menu_active='',
    )
    def get(self, request, pk, *args, **kwargs):
        http_method = "POST"
        username = "API"
        password = "Api@0317493763"
        token = generate_token(http_method, username, password)
        headers = {"Authentication": f"{token}", "Content-Type": "application/json"}
        response = requests.post(
            "http://0317493763.softdreams.vn/api/publish/viewInvoice",
            headers=headers,
            json={
                'Ikey': pk + '-' + request.GET.get('pattern'),
                'Pattern': request.GET.get('pattern'),
                'Option': 0
            },
            timeout=60
        )
        if response.status_code != 200:
            return {}, response.status_code
        return {
            'data': {'html': json.loads(response.text).get('Data', {}).get('Html')},
        }, status.HTTP_200_OK


class ARInvoiceRecurrenceListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.AR_INVOICE_RECURRENCE_LIST).get(data)
        return resp.auto_return(key_success='ar_invoice_recurrence')
