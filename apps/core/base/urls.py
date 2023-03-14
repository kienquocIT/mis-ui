from django.urls import path

from apps.core.base.views import PlanListAPI, TenantApplicationListAPI, ApplicationPropertyListAPI, \
    ApplicationPropertyEmployeeListAPI, ApplicationListAPI

urlpatterns = [
    path('plan/api', PlanListAPI.as_view(), name='PlanListAPI'),
    path('tenant-application/api', TenantApplicationListAPI.as_view(), name='TenantApplicationListAPI'),
    path('application-property/api', ApplicationPropertyListAPI.as_view(), name='ApplicationPropertyListAPI'),
    path(
        'application-property-employee/api',
        ApplicationPropertyEmployeeListAPI.as_view(),
        name='ApplicationPropertyEmployeeListAPI'
    ),
    path('applications-list/api', ApplicationListAPI.as_view(), name='ApplicationListAPI'),
]
