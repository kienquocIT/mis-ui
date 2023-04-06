from django.urls import path

from apps.core.workflow.views.config import WorkflowList, WorkflowListAPI, WorkflowCreate, WorkflowCreateAPI, \
    WorkflowDetail, NodeSystemListAPI, WorkflowDetailAPI

urlpatterns = [
    path('lists', WorkflowList.as_view(), name='WorkflowList'),
    path('api/lists', WorkflowListAPI.as_view(), name='WorkflowListAPI'),
    path('create', WorkflowCreate.as_view(), name='WorkflowCreate'),
    path('api/create', WorkflowCreateAPI.as_view(), name='WorkflowCreateAPI'),
    path('detail/<str:pk>', WorkflowDetail.as_view(), name='WorkflowDetail'),
    path('detail-api/<str:pk>', WorkflowDetailAPI.as_view(), name='WorkflowDetailAPI'),
    path('node/system', NodeSystemListAPI.as_view(), name='NodeSystemListAPI'),
]
