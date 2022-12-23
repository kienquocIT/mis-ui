from django.urls import path

from apps.core.hr.views import EmployeeList, EmployeeCreate, EmployeeListAPI

urlpatterns = [
    path('employee', EmployeeList.as_view(), name='EmployeeList'),
    path('employee/api', EmployeeListAPI.as_view(), name='EmployeeListAPI'),
    path('employee/create', EmployeeCreate.as_view(), name='EmployeeCreate'),
]
