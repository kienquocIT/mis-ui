from django.urls import path

from .views import (
    OpportunityTaskConfig, OpportunityTaskConfigAPI, OpportunityTaskList,
    OpportunityTaskListAPI, OpportunityTaskStatusAPI, OpportunityTaskDetailAPI, OpportunityTaskLogTimeAPI,
    MyTaskReportAPI, MyTaskSummaryReport, TaskAssigneeGroupListAPI, OpportunityTaskHasGroupListAPI, TaskDashboard
)

urlpatterns = [
    path('config', OpportunityTaskConfig.as_view(), name='OpportunityTaskConfig'),
    path('config/api', OpportunityTaskConfigAPI.as_view(), name='OpportunityTaskConfigAPI'),
    path('task-status/api', OpportunityTaskStatusAPI.as_view(), name='OpportunityTaskStatusAPI'),
    path('list', OpportunityTaskList.as_view(), name='OpportunityTaskList'),
    path('list/api', OpportunityTaskListAPI.as_view(), name='OpportunityTaskListAPI'),
    path('detail/<str:pk>', OpportunityTaskDetailAPI.as_view(), name='OpportunityTaskDetailAPI'),
    path('task/log-time', OpportunityTaskLogTimeAPI.as_view(), name='OpportunityTaskLogTimeAPI'),

    path('my-report', MyTaskReportAPI.as_view(), name='MyTaskReportAPI'),
    path('my-summary-report', MyTaskSummaryReport.as_view(), name='MyTaskSummaryReport'),

    path('assignee-group/api', TaskAssigneeGroupListAPI.as_view(), name='TaskAssigneeGroupListAPI'),
    path(
        'list-with-group/api', OpportunityTaskHasGroupListAPI.as_view(),
        name='OpportunityTaskHasGroupListAPI'
    ),
    path('dashboard', TaskDashboard.as_view(), name='TaskDashboard'),
]
