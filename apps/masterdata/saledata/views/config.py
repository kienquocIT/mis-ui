from rest_framework import status
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from apps.shared import mask_view, ServerAPI, ApiURL, MDConfigMsg


class PaymentsTermsListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PAYMENT_TERMS).get()
        return resp.auto_return(key_success='payment_terms_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS).post(request.data)
        if resp.state:
            resp.result['message'] = MDConfigMsg.PT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PaymentsTermsDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = MDConfigMsg.PT_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS.push_id(pk)).delete(request.data)
        if resp.state:
            resp.result['message'] = MDConfigMsg.PT_DELETE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
