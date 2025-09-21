from django.views import View
from rest_framework import status
from apps.shared import mask_view, ApiURL, ServerAPI


class DashboardCommonPage(View):
    @mask_view(
        auth_require=True,
        template='sales/dashboard/dashboard.html',
        breadcrumb='DASHBOARD_COMMON_PAGE',
        menu_active='id_menu_dashboard',
        icon_cls='fas fa-chart-column',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DashboardGeneralList(View):
    @mask_view(
        auth_require=True,
        template='sales/dashboard/dashboard_general_echarts.html',
        breadcrumb='DASHBOARD_GENERAL_LIST_PAGE',
        icon_cls='fas fa-chart-line',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {
                'data': {'current_period': resp1.result[0]},
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class DashboardPipelineList(View):
    @mask_view(
        auth_require=True,
        template='sales/dashboard/dashboard_pipeline_echarts.html',
        breadcrumb='DASHBOARD_PIPELINE_LIST_PAGE',
        icon_cls='fas fa-filter',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {
                'data': {'current_period': resp1.result[0]},
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK
