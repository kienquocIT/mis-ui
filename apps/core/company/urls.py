from django.urls import path
from apps.core.company.views import CompanyList, CompanyListAPI, CompanyDetailAPI

urlpatterns = [
    path('list', CompanyList.as_view(), name='CompanyList'),
    path('list/api', CompanyListAPI.as_view(), name='CompanyListAPI'),
    path('list/<str:pk>', CompanyDetailAPI.as_view(), name='CompanyDetailAPI'),

]
