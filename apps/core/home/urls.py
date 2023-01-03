from django.urls import path
from .views import (HomeView, TenantCompany,
                    TenantCompanyListAPI)

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
    path('tenant/company', TenantCompany.as_view(), name='TenantCompany'),
    path('tenant/company/api', TenantCompanyListAPI.as_view(), name='TenantCompanyListAPI'),
    # path('tenant/company/create', TenantCompanyCreate.as_view(), name='TenantCompanyCreate'),
]
