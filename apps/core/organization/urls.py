from django.urls import path

from apps.core.organization.views import GroupLevelList, GroupLevelCreate, GroupLevelListAPI

urlpatterns = [
    path('level', GroupLevelList.as_view(), name='GroupLevelList'),
    path('level/api', GroupLevelListAPI.as_view(), name='GroupLevelListAPI'),
    path('level/create', GroupLevelCreate.as_view(), name='GroupLevelCreate'),
]
