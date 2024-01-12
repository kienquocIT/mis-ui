from django.urls import path
from apps.sales.dashboard.views import (
    DashboardGeneralList, DashboardPipelineList
)

urlpatterns = [
    path('general', DashboardGeneralList.as_view(), name='DashboardGeneralList'),
    path('pipeline', DashboardPipelineList.as_view(), name='DashboardPipelineList'),
]
