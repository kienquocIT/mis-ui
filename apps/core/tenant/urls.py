from django.urls import path
from apps.core.tenant.views import (
    TenantInformation, TenantInformationAPI, TenantPlanListAPI,
    TenantDiagramView, TenantDiagramAPI,
)

urlpatterns = [
    path('userlist', TenantInformation.as_view(), name='TenantInformation'),
    path('userlist/api', TenantInformationAPI.as_view(), name='TenantInformationAPI'),
    path('tenantplan/api', TenantPlanListAPI.as_view(), name='TenantPlanListAPI'),
    path('chart', TenantDiagramView.as_view(), name='TenantDiagramView'),
    path('chart/api', TenantDiagramAPI.as_view(), name='TenantDiagramAPI'),
]
