from django.urls import path

from apps.core.company.views import CompanyList, CompanyListAPI

urlpatterns = [
    path('list', CompanyList.as_view(), name='CompanyList'),
    path('list/api', CompanyListAPI.as_view(), name='CompanyListAPI'),
]
