from django.urls import path

from apps.core.workflow.views.config import (
    WorkflowList, WorkflowListAPI, WorkflowCreate, WorkflowCreateAPI,
    WorkflowDetail, NodeSystemListAPI, WorkflowDetailAPI,
    WorkflowOfAppListAPI, WorkflowOfAppDetailAPI, WorkflowUpdate, WorkflowCurrentOfAppListAPI,
)

from apps.core.workflow.views.runtime import (
    FlowRuntimeDetailAPI,
    FlowRuntimeListAPI, FlowRuntimeDiagramDetailAPI,
    FlowRuntimeTaskListAPI, FlowRuntimeTaskDetailAPI,
    FlowRuntimeMeListAPI, FlowRuntimeAfterFinishDetailAPI,
)

urlpatterns = [
    path('lists', WorkflowList.as_view(), name='WorkflowList'),
    path('api/lists', WorkflowListAPI.as_view(), name='WorkflowListAPI'),
    path('create', WorkflowCreate.as_view(), name='WorkflowCreate'),
    path('api/create', WorkflowCreateAPI.as_view(), name='WorkflowCreateAPI'),
    path('detail/<str:pk>', WorkflowDetail.as_view(), name='WorkflowDetail'),
    path('detail-api/<str:pk>', WorkflowDetailAPI.as_view(), name='WorkflowDetailAPI'),
    path('update/<str:pk>', WorkflowUpdate.as_view(), name='WorkflowUpdate'),
    path('node/system', NodeSystemListAPI.as_view(), name='NodeSystemListAPI'),

    # apps
    path('apps/api', WorkflowOfAppListAPI.as_view(), name='WorkflowOfAppListAPI'),
    path('app/api/<str:pk>', WorkflowOfAppDetailAPI.as_view(), name='WorkflowOfAppDetailAPI'),

    # current
    path('currents/api', WorkflowCurrentOfAppListAPI.as_view(), name='WorkflowCurrentOfAppListAPI'),

    # runtime
    path('runtime/diagram/<str:pk>', FlowRuntimeDiagramDetailAPI.as_view(), name='FlowRuntimeDiagramDetailAPI'),
    path('runtime/task/<str:pk>', FlowRuntimeTaskDetailAPI.as_view(), name='FlowRuntimeTaskDetailAPI'),
    path('runtime/tasks', FlowRuntimeTaskListAPI.as_view(), name='FlowRuntimeTaskListAPI'),
    path('runtimes/me', FlowRuntimeMeListAPI.as_view(), name='FlowRuntimeMeListAPI'),
    path('runtimes/<str:flow_id>', FlowRuntimeListAPI.as_view(), name='FlowRuntimeListAPI'),
    path('runtime/<str:pk>', FlowRuntimeDetailAPI.as_view(), name='FlowRuntimeDetailAPI'),
    path('runtime-after/<str:pk>', FlowRuntimeAfterFinishDetailAPI.as_view(), name='FlowRuntimeAfterFinishDetailAPI'),
]
