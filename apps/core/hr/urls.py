from django.urls import path

from apps.core.hr.views import EmployeeList, EmployeeCreate, EmployeeListAPI, GroupDetailAPI, GroupLevelList, \
    GroupLevelListAPI, GroupLevelCreate, GroupList, GroupListAPI, GroupCreate, GroupUpdate, GroupDetail
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

    path('level', GroupLevelList.as_view(), name='GroupLevelList'),
    path('level/api', GroupLevelListAPI.as_view(), name='GroupLevelListAPI'),
    path('level/create', GroupLevelCreate.as_view(), name='GroupLevelCreate'),
    path('group', GroupList.as_view(), name='GroupList'),
    path('group/api', GroupListAPI.as_view(), name='GroupListAPI'),
    path('group/create', GroupCreate.as_view(), name='GroupCreate'),
    path('group/<str:pk>', GroupDetailAPI.as_view(), name='GroupDetailAPI'),
    path('group/detail/<str:pk>', GroupDetail.as_view(), name='GroupDetail'),
    path('group/update/<str:pk>', GroupUpdate.as_view(), name='GroupUpdate'),
]
