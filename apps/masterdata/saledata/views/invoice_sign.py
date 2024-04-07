from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck


class InvoiceSignList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/invoice_sign.html',
        breadcrumb='INVOICE_SIGN_PAGE',
        menu_active='menu_invoice_sign',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVOICE_SIGN_LIST).get()
        return {
            'invoice_signs': resp.result[0] if len(resp.result) > 0 else ''
        }, status.HTTP_200_OK


class InvoiceSignListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVOICE_SIGN_LIST).post(request.data)
        return resp.auto_return()
