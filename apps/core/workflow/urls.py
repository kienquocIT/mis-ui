from django.urls import path

from apps.core.workflow.views.config import WorkflowList, WorkflowListAPI

urlpatterns = [
    path('lists', WorkflowList.as_view(), name='WorkflowList'),
    path('api/lists', WorkflowListAPI.as_view(), name='WorkflowListAPI'),
]
