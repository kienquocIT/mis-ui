from django.urls import path
from apps.sales.dashboard.views import (
    DashboardList
)

urlpatterns = [
    path('dashboards', DashboardList.as_view(), name='DashboardList'),
    # path('dashboards/api', DashboardListAPI.as_view(), name='DashboardListAPI'),
    # path('dashboard/detail/<str:pk>', DashboardDetail.as_view(), name='DashboardDetail'),
    # path('dashboard/api/<str:pk>', DashboardDetailAPI.as_view(), name='DashboardDetailAPI'),
]
