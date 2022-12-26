from django.urls import path
from apps.core.organization.views import GroupList, GroupListAPI

urlpatterns = [
    path('group', GroupList.as_view(), name='GroupList'),
    path('group/api', GroupListAPI.as_view(), name='GroupListAPI'),
]
