from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view

__all__ = ['PromotionList', 'PromotionCreate']


class PromotionList(APIView):
    @mask_view(
        auth_require=True,
        template='sale/promotion/promotion_list.html',
        breadcrumb='PROMOTION_LIST_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

class PromotionCreate(APIView):
    @mask_view(
        auth_require=True,
        template='sale/promotion/promotion_create.html',
        breadcrumb='PROMOTION_CREATE_PAGE',
        menu_active='menu_pricing',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
