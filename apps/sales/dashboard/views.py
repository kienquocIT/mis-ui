from django.conf import settings
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties
import requests

from apps.shared.msg import SaleMsg


class DashboardGeneralList(View):
    @mask_view(
        auth_require=True,
        template='sales/dashboard/dashboard_general.html',
        breadcrumb='DASHBOARD_GENERAL_LIST_PAGE',
        menu_active='id_menu_dashboard_general',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DashboardPipelineList(View):
    @mask_view(
        auth_require=True,
        template='sales/dashboard/dashboard_pipeline.html',
        breadcrumb='DASHBOARD_PIPELINE_LIST_PAGE',
        menu_active='id_menu_dashboard_pipeline',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
