import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS


class ProductionOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/productionorder/production_order_create.html',
        menu_active='',
        breadcrumb='PRODUCTION_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        return ctx, status.HTTP_200_OK
