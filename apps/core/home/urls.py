from django.urls import path
from .views import HomeView, TenantCompany, TenantCompanyCreateAPI

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
    path('tenant/company', TenantCompany.as_view(), name='TenantCompany'),
    path('create/api', TenantCompanyCreateAPI.as_view(), name='TenantCompanyCreateAPI'),
]
