from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class PurchaseRequestCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_create.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PurchaseRequestList(View):
    @mask_view(
        auth_require=True,
        template='sales/purchasing/purchase_request/purchase_request_list.html',
        menu_active='menu_purchase_request_list',
        breadcrumb='',
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