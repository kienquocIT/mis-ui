from django.urls import path
from apps.core.company.views import CompanyList, CompanyListAPI

from apps.core.company.views import (
    CompanyList, CompanyListAPI,
    CompanyListOverviewList, CompanyListOverviewListAPI,
    CompanyListOverviewDetail, EmployeeUserByCompanyListOverviewDetailAPI,
    EmployeeByCompanyListOverviewDetailAPI, UserByCompanyListOverviewDetailAPI, CompanyOfUserForOverviewDetailAPI,
    CompanyDetailAPI,
    CompanyUpdateAPI,
    CompanyDeleteAPI
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

    path(
        'list/overview/employee/<str:pk>', EmployeeByCompanyListOverviewDetailAPI.as_view(),
        name='EmployeeByCompanyListOverviewDetailAPI'
    ),
    path(
        'list/overview/user/<str:pk>', UserByCompanyListOverviewDetailAPI.as_view(),
        name='UserByCompanyListOverviewDetailAPI'
    ),

    path(
        'list/overview/company-of-user/<str:pk>', CompanyOfUserForOverviewDetailAPI.as_view(),
        name='CompanyOfUserForOverviewDetailAPI'
    ),

]
