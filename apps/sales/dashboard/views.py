from django.conf import settings
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties
import requests

from apps.shared.msg import SaleMsg


class DashboardList(View):
    @mask_view(
        auth_require=True,
        template='dashboard/dashboard_list.html',
        breadcrumb='DASHBOARD_LIST_PAGE',
        menu_active='id_menu_dashboard',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
