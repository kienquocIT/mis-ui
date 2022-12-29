from django.urls import path

from .views import OrganizationCreate, OrganizationCreateAPI, RoleList
from apps.core.organization.views import GroupLevelList, GroupLevelCreate, GroupLevelListAPI
from .views import OrganizationCreate

urlpatterns = [
    path('level', GroupLevelList.as_view(), name='GroupLevelList'),
    path('level/api', GroupLevelListAPI.as_view(), name='GroupLevelListAPI'),
    path('level/create', GroupLevelCreate.as_view(), name='GroupLevelCreate'),
    path('group/create', OrganizationCreate.as_view(), name='OrganizationCreate'),
    path('create/api', OrganizationCreateAPI.as_view(), name='OrganizationCreateAPI'),

    path('role', RoleList.as_view(), name='RoleList'),
]
