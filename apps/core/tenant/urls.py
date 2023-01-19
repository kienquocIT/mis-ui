from django.urls import path
from apps.core.tenant.views import TenantInformation, TenantInformationAPI

urlpatterns = [
    path('userlist', TenantInformation.as_view(), name='TenantInformation'),
    path('userlist/api', TenantInformationAPI.as_view(), name='TenantInformationAPI'),
]
