from django.urls import path
from apps.core.company.views import CompanyUserNotMapEmployeeListAPI

from apps.core.company.views import (
    CompanyList, CompanyListAPI, CompanyListOverviewList, CompanyListOverviewListAPI,
    EmployeeUserByCompanyListOverviewDetailAPI, EmployeeOfTenantListAPI,
    CompanyDetail, CompanyUpdateAPI, CompanyDeleteAPI,
    CompanyConfigDetailAPI,
)

urlpatterns = [
    path('config', CompanyConfigDetailAPI.as_view(), name='CompanyConfigDetailAPI'),
    path('list', CompanyList.as_view(), name='CompanyList'),
    path('list/api', CompanyListAPI.as_view(), name='CompanyListAPI'),
    path('detail/<str:pk>', CompanyDetail.as_view(), name='CompanyDetail'),
    path('update/<str:pk>', CompanyUpdateAPI.as_view(), name='CompanyUpdateAPI'),
    path('delete/<str:pk>', CompanyDeleteAPI.as_view(), name='CompanyDeleteAPI'),

    # view from tenant overview
    path('list/overview', CompanyListOverviewList.as_view(), name='CompanyListOverviewList'),
    path('list/overview/api', CompanyListOverviewListAPI.as_view(), name='CompanyListOverviewListAPI'),
    path(
        'list/overview/employee-user/<str:pk>', EmployeeUserByCompanyListOverviewDetailAPI.as_view(),
        name='EmployeeUserByCompanyListOverviewDetailAPI'
    ),
    path('list/user-available', CompanyUserNotMapEmployeeListAPI.as_view(), name='CompanyUserNotMapEmployeeListAPI'),
    path('list/employee-by-company', EmployeeOfTenantListAPI.as_view(), name='EmployeeOfTenantListAPI'),
]
