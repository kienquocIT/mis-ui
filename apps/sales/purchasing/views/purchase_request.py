from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck
from apps.shared.msg.purchasing import PurchasingMsg


class PurchaseRequestCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_create.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestList(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_list.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST).get()
        return resp.auto_return(key_success='purchase_request_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = PurchasingMsg.PURCHASE_REQUEST_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class PurchaseRequestDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_detail.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='PURCHASE_REQUEST_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='purchase_request')


class PurchaseRequestProductListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_PRODUCT_LIST).get(data)
        return resp.auto_return(key_success='purchase_request_product_list')


class PurchaseRequestListForPQRAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PURCHASE_REQUEST_LIST_FOR_PQR).get()
        return resp.auto_return(key_success='purchase_request_list')


class PurchaseRequestConfig(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/config.html',
        menu_active='menu_purchase_request_config',
        breadcrumb='PURCHASE_REQUEST_CONFIG_PAGE',
        perm_check=PermCheck(url=ApiURL.PURCHASE_REQUEST_CONFIG, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_CONFIG).get()
        return resp.auto_return(key_success='config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PURCHASE_REQUEST_CONFIG).put(request.data)
        return resp.auto_return()
