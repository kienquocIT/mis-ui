from django.urls import path

from apps.core.process.views import (
    ProcessList, ProcessCreate, ProcessListAPI, ProcessReadyListAPI,
    ProcessUpdate, ProcessDetailAPI, ProcessDetail,
    ProcessRuntimeOfMeAPI, ProcessRuntimeAPI,
    ProcessRuntimeDetailView, ProcessRuntimeListView, ProcessRuntimeListMeRedirect, ProcessRuntimeDetailAPI,
    ProcessRuntimeStageAppDetailAPI,
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
    path('runtime/detail/<str:pk>', ProcessRuntimeDetailView.as_view(), name='ProcessRuntimeDetailView'),
    path('runtime/detail/<str:pk>/api', ProcessRuntimeDetailAPI.as_view(), name='ProcessRuntimeDetailAPI'),
    path('runtime/app/<str:pk>/api', ProcessRuntimeStageAppDetailAPI.as_view(),name='ProcessRuntimeStageAppDetailAPI'),
]
