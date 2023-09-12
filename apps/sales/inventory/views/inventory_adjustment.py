from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class InventoryAdjustmentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/inventory_adjustment/inventory_adjustment_list.html',
        menu_active='menu_inventory_activities',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class InventoryAdjustmentCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/inventory_adjustment/inventory_adjustment_create.html',
        menu_active='menu_inventory_activities',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
