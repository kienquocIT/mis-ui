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
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROMOTION_LIST).get()
        return resp.auto_return(key_success='promotion_list')


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
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROMOTION_LIST).post(data)
        if resp.state:
            resp.result['message'] = PromotionMsg.CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


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
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROMOTION_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROMOTION_DETAIL.push_id(pk)).put(request.data)
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROMOTION_DETAIL.push_id(pk)).delete(request.data)
        if resp.state:
            resp.result['message'] = PromotionMsg.DELETE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class PromotionCheckListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROMOTION_CHECK_LIST).get(data)
        return resp.auto_return(key_success='promotion_check_list')

