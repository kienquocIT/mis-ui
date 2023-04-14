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
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS).get()
        if resp.state:
            return {'payment_terms_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS).post(data)
        if resp.state:
            resp.result['message'] = MDConfigMsg.PT_CREATE
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class PaymentsTermsDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        # check request is not ajax return false
        if 'application/json' not in request.META.get('HTTP_ACCEPT', ''):
            return {'errors': 'this request not support'}, status.HTTP_400_BAD_REQUEST
        res = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS.push_id(pk)).get()
        if res.state:
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = MDConfigMsg.PT_UPDATE
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PAYMENT_TERMS.push_id(pk)).delete(request.data)
        if resp.state:
            resp.result['message'] = MDConfigMsg.PT_DELETE
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
