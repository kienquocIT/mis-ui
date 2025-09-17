from django.urls import path
from apps.sales.dashboard.views import (
    DashboardGeneralList, DashboardPipelineList, DashboardCommonPage
)

urlpatterns = [
    path('common', DashboardCommonPage.as_view(), name='DashboardCommonPage'),
    path('general', DashboardGeneralList.as_view(), name='DashboardGeneralList'),
    path('pipeline', DashboardPipelineList.as_view(), name='DashboardPipelineList'),
]
