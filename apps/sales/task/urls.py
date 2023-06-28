from django.urls import path

from apps.sales.task.views import OpportunityTaskConfig, OpportunityTaskConfigAPI, OpportunityTaskList, \
    OpportunityTaskListAPI, OpportunityTaskStatusAPI

urlpatterns = [
    path('config', OpportunityTaskConfig.as_view(), name='OpportunityTaskConfig'),
    path('config/api', OpportunityTaskConfigAPI.as_view(), name='OpportunityTaskConfigAPI'),
    path('task-status/api', OpportunityTaskStatusAPI.as_view(), name='OpportunityTaskStatusAPI'),
    path('list', OpportunityTaskList.as_view(), name='OpportunityTaskList'),
    path('list/api', OpportunityTaskListAPI.as_view(), name='OpportunityTaskListAPI'),
]
