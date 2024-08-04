import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS


class ContractCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/contract/contract_create.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'employee_current': request.user.employee_current_data,
            'input_mapping_properties': InputMappingProperties.QUOTATION_QUOTATION,
            'form_id': 'frm_quotation_create',
        }
        return {}, status.HTTP_200_OK
