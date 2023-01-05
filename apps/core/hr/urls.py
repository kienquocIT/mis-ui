from django.urls import path

from apps.core.hr.views import EmployeeList, EmployeeCreate, EmployeeListAPI
from apps.core.hr.views import RoleList, RoleListAPI, RoleCreate, RoleDetail, RoleDetailAPI

urlpatterns = [
    path('employee', EmployeeList.as_view(), name='EmployeeList'),
    path('employee/api', EmployeeListAPI.as_view(), name='EmployeeListAPI'),
    path('employee/create', EmployeeCreate.as_view(), name='EmployeeCreate'),

    path('role', RoleList.as_view(), name='RoleList'),
    path('role/api', RoleListAPI.as_view(), name='RoleListAPI'),
    path('role/create', RoleCreate.as_view(), name='RoleCreate'),
    path('role/<str:pk>', RoleDetail.as_view(), name='RoleDetail'),
    path('role/<str:pk>/api', RoleDetailAPI.as_view(), name='RoleDetailAPI'),
]
