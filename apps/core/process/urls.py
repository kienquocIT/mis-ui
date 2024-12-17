from django.urls import path

from apps.core.process.views import (
    ProcessList, ProcessCreate, ProcessListAPI, ProcessReadyListAPI,
    ProcessUpdate, ProcessDetailAPI, ProcessDetail,
    ProcessRuntimeOfMeAPI, ProcessRuntimeAPI,
    ProcessRuntimeDetailView, ProcessRuntimeListView, ProcessRuntimeListMeRedirect, ProcessRuntimeDetailAPI,
    ProcessRuntimeStageAppDetailAPI, ProcessStagesAppOfMeAPI, ProcessRuntimeDataMatchAPI, ProcessRuntimeMembersAPI,
    ProcessRuntimeMemberDetailAPI, ProcessRuntimeLogAPI, ProcessMembersSyncAPI,
)

urlpatterns = [
    path('config/list', ProcessList.as_view(), name='ProcessList'),
    path('config/create', ProcessCreate.as_view(), name='ProcessCreate'),
    path('config/update/<str:pk>', ProcessUpdate.as_view(), name='ProcessUpdate'),
    path('config/detail/<str:pk>', ProcessDetail.as_view(), name='ProcessDetail'),

    path('config/list/api', ProcessListAPI.as_view(), name='ProcessListAPI'),
    path('config/list/ready/api', ProcessReadyListAPI.as_view(), name='ProcessReadyListAPI'),
    path('config/detail/<str:pk>/api', ProcessDetailAPI.as_view(), name='ProcessDetailAPI'),

    path('runtime/list', ProcessRuntimeListView.as_view(), name='ProcessRuntimeListView'),
    path('runtime/list/me/redirect', ProcessRuntimeListMeRedirect.as_view(), name='ProcessRuntimeListMeRedirect'),
    path('runtime/list/api', ProcessRuntimeAPI.as_view(), name='ProcessRuntimeAPI'),
    path('runtime/list/me/api', ProcessRuntimeOfMeAPI.as_view(), name='ProcessRuntimeOfMeAPI'),
    path('runtime/stages-apps/me/api', ProcessStagesAppOfMeAPI.as_view(), name='ProcessStagesAppOfMeAPI'),
    path('runtime/data-match/api', ProcessRuntimeDataMatchAPI.as_view(), name='ProcessRuntimeDataMatchAPI'),
    path('runtime/detail/<str:pk>', ProcessRuntimeDetailView.as_view(), name='ProcessRuntimeDetailView'),
    path('runtime/detail/<str:pk>/members/api', ProcessRuntimeMembersAPI.as_view(), name='ProcessRuntimeMembersAPI'),
    path('runtime/detail/<str:pk>/members/sync/api', ProcessMembersSyncAPI.as_view(), name='ProcessMembersSyncAPI'),
    path('runtime/detail/<str:pk>/api', ProcessRuntimeDetailAPI.as_view(), name='ProcessRuntimeDetailAPI'),
    path('runtime/app/<str:pk>/api', ProcessRuntimeStageAppDetailAPI.as_view(), name='ProcessRuntimeStageAppDetailAPI'),
    path('runtime/member/<str:pk>', ProcessRuntimeMemberDetailAPI.as_view(), name='ProcessRuntimeMemberDetailAPI'),
    path('runtime/log/<str:pk>', ProcessRuntimeLogAPI.as_view(), name='ProcessRuntimeLogAPI'),
]
