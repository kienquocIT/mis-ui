import json

from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties, BaseView
from apps.shared.constant import SYSTEM_STATUS


class ShiftAssignmentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='hrm/attendance/shiftassignment/shift_assignment.html',
        menu_active='menu_quotation_list',
        breadcrumb='QUOTATION_LIST_PAGE',
        icon_cls='fas fa-user-clock',
        icon_bg='bg-pink',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK
