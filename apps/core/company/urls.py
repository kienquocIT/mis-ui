from django.urls import path
from apps.core.company.views import CompanyUserNotMapEmployeeListAPI

from apps.core.company.views import (
    CompanyList, CompanyListAPI,
    CompanyListOverviewList, CompanyListOverviewListAPI,
    CompanyListOverviewDetail, EmployeeUserByCompanyListOverviewDetailAPI,
    CompanyDetailAPI,
    CompanyUpdateAPI,
    CompanyDeleteAPI,
    EmployeeOfTenantListAPI,
)

urlpatterns = [
    path('list', CompanyList.as_view(), name='CompanyList'),
    path('list/api', CompanyListAPI.as_view(), name='CompanyListAPI'),
    path('detail/<str:pk>', CompanyDetailAPI.as_view(), name='CompanyDetailAPI'),
    path('update/<str:pk>', CompanyUpdateAPI.as_view(), name='CompanyUpdateAPI'),
    path('delete/<str:pk>', CompanyDeleteAPI.as_view(), name='CompanyDeleteAPI'),

    # view from tenant overview
    path('list/overview', CompanyListOverviewList.as_view(), name='CompanyListOverviewList'),
    path('list/overview/api', CompanyListOverviewListAPI.as_view(), name='CompanyListOverviewListAPI'),
    path('list/overview/<str:pk>', CompanyListOverviewDetail.as_view(), name='CompanyListOverviewDetail'),
    path(
        'list/overview/employee-user/<str:pk>', EmployeeUserByCompanyListOverviewDetailAPI.as_view(),
        name='EmployeeUserByCompanyListOverviewDetailAPI'
    ),
    path('list/user-available', CompanyUserNotMapEmployeeListAPI.as_view(), name='CompanyUserNotMapEmployeeListAPI'),
    path('list/employee-by-company', EmployeeOfTenantListAPI.as_view(), name='EmployeeOfTenantListAPI'),
]
