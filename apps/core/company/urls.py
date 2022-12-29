from django.urls import path

from .views import CompanyList

urlpatterns = [
    path('list', CompanyList.as_view(), name='CompanyList'),
]
