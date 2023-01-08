from django.urls import path
from apps.core.tenant.views import TenantInformation, TenantInformationAPI

urlpatterns = [
    path('', TenantInformation.as_view(), name='TenantInformation'),
    path('api', TenantInformationAPI.as_view(), name='TenantInformationAPI'),
]
