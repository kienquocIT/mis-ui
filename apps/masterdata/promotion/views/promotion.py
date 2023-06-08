import json

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.core.workflow.views.config import WORKFLOW_TYPE
from apps.shared import mask_view, ServerAPI, ApiURL, PromotionMsg, CUSTOMER_REVENUE, COMPANY_SIZE
from django.utils.translation import gettext_lazy as _

__all__ = ['PromotionList', 'PromotionCreate', 'PromotionListAPI', 'PromotionCreateAPI',
           'PromotionDetail', 'PromotionDetailAPI', 'PromotionCheckListAPI']


class PromotionList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/promotion/promotion_list.html',
        breadcrumb='PROMOTION_LIST_PAGE',
        menu_active='id_menu_promotion_list',
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
        return {
                   'revenue': CUSTOMER_REVENUE,
                   'company_size': COMPANY_SIZE,
                   'cus_operator': WORKFLOW_TYPE[4],
               }, status.HTTP_200_OK


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
        return {
                   'doc_id': pk,
                   'revenue': CUSTOMER_REVENUE,
                   'company_size': COMPANY_SIZE,
                   'cus_operator': WORKFLOW_TYPE[4],
               }, status.HTTP_200_OK


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

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        req = ServerAPI(user=request.user, url=ApiURL.PROMOTION_DETAIL.push_id(pk)).put(request.data)
        if req.state:
            return req.result, status.HTTP_200_OK
        elif req.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': req.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        req = ServerAPI(user=request.user, url=ApiURL.PROMOTION_DETAIL.push_id(pk)).delete(request.data)
        if req.state:
            req.result['message'] = PromotionMsg.DELETE
            return req.result, status.HTTP_200_OK
        elif req.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': req.errors}, status.HTTP_400_BAD_REQUEST


class PromotionCheckListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PROMOTION_CHECK_LIST).get(data)
        if resp.state:
            return {'promotion_check_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

