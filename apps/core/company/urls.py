from django.urls import path
from apps.core.company.views import CompanyUserNotMapEmployeeListAPI

from apps.core.company.views import (
    CompanyList, CompanyListAPI, CompanyListOverviewList, CompanyListOverviewListAPI,
    EmployeeUserByCompanyListOverviewDetailAPI, EmployeeOfTenantListAPI,
    CompanyDetail, CompanyDetailAPI, CompanyDeleteAPI,
    CompanyConfigDetailAPI, CompanyCreate, CompanyUpdate, TestEmailConnection
)

urlpatterns = [
    path('config', CompanyConfigDetailAPI.as_view(), name='CompanyConfigDetailAPI'),
    path('list', CompanyList.as_view(), name='CompanyList'),
    path('create', CompanyCreate.as_view(), name='CompanyCreate'),
    path('detail/<str:pk>', CompanyDetail.as_view(), name='CompanyDetail'),
    path('update/<str:pk>', CompanyUpdate.as_view(), name='CompanyUpdate'),
    path('list/api', CompanyListAPI.as_view(), name='CompanyListAPI'),
    path('detail/api/<str:pk>', CompanyDetailAPI.as_view(), name='CompanyDetailAPI'),
    path('delete/api/<str:pk>', CompanyDeleteAPI.as_view(), name='CompanyDeleteAPI'),
    path('test-email-connection', TestEmailConnection.as_view(), name='TestEmailConnection'),

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
