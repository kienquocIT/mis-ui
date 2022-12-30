from django.urls import path

from .views import OrganizationCreate, OrganizationCreateAPI, RoleList
from apps.core.organization.views import GroupList, GroupLevelList, GroupLevelCreate, GroupLevelListAPI
from .views import OrganizationCreate, RoleList, RoleListAPI, OrganizationCreateAPI, RoleCreate

urlpatterns = [
    path('level', GroupLevelList.as_view(), name='GroupLevelList'),
    path('level/api', GroupLevelListAPI.as_view(), name='GroupLevelListAPI'),
    path('level/create', GroupLevelCreate.as_view(), name='GroupLevelCreate'),
    path('group', GroupList.as_view(), name='GroupList'),
    path('group/create', OrganizationCreate.as_view(), name='OrganizationCreate'),
    path('group/create', OrganizationCreateAPI.as_view(), name='OrganizationCreateAPI'),

    path('role', RoleList.as_view(), name='RoleList'),
    path('role/api', RoleListAPI.as_view(), name='RoleListAPI'),
    path('role/create', RoleCreate.as_view(), name='RoleCreate'),
]
