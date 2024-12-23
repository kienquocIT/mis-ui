from django.views import View
from apps.shared import ServerAPI, mask_view, SYSTEM_STATUS, ApiURL, SaleMsg, InputMappingProperties
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class ListList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/list_list.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK

class ListCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/partnercenter/list/list_create.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            # "list_from_app": 'consulting.consulting.create',
            # 'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_partnercenter_list_create',
            # 'app_id': '3a369ba582a04c4da4473794b67d1d02'
        }
        return ctx, status.HTTP_200_OK
