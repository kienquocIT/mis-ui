from django.urls import path

from apps.core.workflow.views.config import (
    WorkflowList, WorkflowListAPI, WorkflowCreate, WorkflowCreateAPI,
    WorkflowDetail, NodeSystemListAPI, WorkflowDetailAPI,
)

from apps.core.workflow.views.config import (
    FlowDiagramListAPI, FlowRuntimeDetailAPI, FlowRuntimeListAPI,FlowRuntimeHistoryStageAPI,
    FlowRuntimeTaskAPI, WorkflowOfAppListAPI, WorkflowOfAppDetailAPI,
)

urlpatterns = [
    path('apps/api', WorkflowOfAppListAPI.as_view(), name='WorkflowOfAppListAPI'),
    path('app/api/<str:pk>', WorkflowOfAppDetailAPI.as_view(), name='WorkflowOfAppDetailAPI'),
    path('lists', WorkflowList.as_view(), name='WorkflowList'),
    path('api/lists', WorkflowListAPI.as_view(), name='WorkflowListAPI'),
    path('create', WorkflowCreate.as_view(), name='WorkflowCreate'),
    path('api/create', WorkflowCreateAPI.as_view(), name='WorkflowCreateAPI'),
    path('detail/<str:pk>', WorkflowDetail.as_view(), name='WorkflowDetail'),
    path('detail-api/<str:pk>', WorkflowDetailAPI.as_view(), name='WorkflowDetailAPI'),
    path('node/system', NodeSystemListAPI.as_view(), name='NodeSystemListAPI'),

    # runtime
    path('runtime/list/<str:flow_id>', FlowRuntimeListAPI.as_view(), name='FlowRuntimeListAPI'),
    path('runtime/detail', FlowRuntimeDetailAPI.as_view(), name='FlowRuntimeDetailAPI'),
    path('runtime/diagram', FlowDiagramListAPI.as_view(), name='FlowDiagramListAPI'),
    path('runtime/task/<str:pk>', FlowRuntimeTaskAPI.as_view(), name='FlowRuntimeTaskAPI'),
    path('runtime/history/stage/<str:pk>', FlowRuntimeHistoryStageAPI.as_view(), name='FlowRuntimeHistoryStageAPI'),
]
