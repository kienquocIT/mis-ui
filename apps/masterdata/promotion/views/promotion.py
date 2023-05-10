from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PromotionMsg
from django.utils.translation import gettext_lazy as _

__all__ = ['PromotionList', 'PromotionCreate', 'CustomerParamFieldAPI', 'PromotionListAPI', 'PromotionCreateAPI',
           'PromotionDetail', 'PromotionDetailAPI']


class PromotionList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/promotion/promotion_list.html',
        breadcrumb='PROMOTION_LIST_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PromotionListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROMOTION_LIST).get()
        if resp.state:
            return {'promotion_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST


class PromotionCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/promotion/promotion_create.html',
        breadcrumb='PROMOTION_CREATE_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class PromotionCreateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PROMOTION_LIST).post(data)
        if resp.state:
            resp.result['message'] = PromotionMsg.CREATE
            return resp.result, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

class PromotionDetail(View):
    @mask_view(
        auth_require=True,
        template='masterdata/promotion/promotion_detail.html',
        breadcrumb='PROMOTION_DETAIL_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'doc_id': pk}, status.HTTP_200_OK


class PromotionDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROMOTION_DETAIL.push_id(pk)).get()
        if resp.state:
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class CustomerParamFieldAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_LIST).get()
        if resp.state:
            return {'customer_param_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST
