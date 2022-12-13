from django.urls import path
from .views import HomeView, TenantCompany

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
    path('tenant/company', TenantCompany.as_view(), name='TenantCompany'),
]
