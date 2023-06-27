from django.urls import path

from apps.sales.task.views import OpportunityTaskConfig, OpportunityTaskConfigAPI, OpportunityTaskList, \
    OpportunityTaskListAPI

urlpatterns = [
    path('config', OpportunityTaskConfig.as_view(), name='OpportunityTaskConfig'),
    path('config/api', OpportunityTaskConfigAPI.as_view(), name='OpportunityTaskConfigAPI'),
    path('list', OpportunityTaskList.as_view(), name='OpportunityTaskList'),
    path('list/api', OpportunityTaskListAPI.as_view(), name='OpportunityTaskListAPI'),
]
