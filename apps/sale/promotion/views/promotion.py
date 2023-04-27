from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from django.utils.translation import gettext_lazy as _

__all__ = ['PromotionList', 'PromotionCreate', 'CustomerParamFieldAPI']


class PromotionList(View):
    @mask_view(
        auth_require=True,
        template='sale/promotion/promotion_list.html',
        breadcrumb='PROMOTION_LIST_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

class PromotionCreate(View):
    @mask_view(
        auth_require=True,
        template='sale/promotion/promotion_create.html',
        breadcrumb='PROMOTION_CREATE_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


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
