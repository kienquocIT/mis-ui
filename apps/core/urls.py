from django.urls import path, include
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, TypeCheck, ServerAPI, ApiURL


urlpatterns = [
    path('auth/', include('apps.core.auths.urls')),
    path('account/', include('apps.core.account.urls')),
    path('hr/', include('apps.core.hr.urls')),
    path('company/', include('apps.core.company.urls')),
    path('base/', include('apps.core.base.urls')),
    path('tenant/', include('apps.core.tenant.urls')),
    path('workflow/', include('apps.core.workflow.urls')),

    path('', include('apps.core.home.urls')),  # home page
]
