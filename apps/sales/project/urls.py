from django.urls import path

from apps.sales.project.views import ProjectList, ProjectCreate, ProjectCreateAPI, ProjectListAPI, ProjectDetail, \
    ProjectDetailAPI, ProjectEdit, ProjectEditAPI, ProjectCreateGroupAPI, ProjectWorkCreateAPI, ProjectGroupListAPI, \
    ProjectWorkListAPI, ProjectGroupDetailAPI, ProjectWorkDetailAPI, ProjectMemberAddAPI, ProjectMemberDetailAPI, \
    ProjectUpdateOrderAPI, ProjectTaskListAPI, ProjectGroupDDListAPI, ProjectTaskDetailAPI, ProjectWorkExpenseAPI, \
    ProjectListBaselineAPI, ProjectBaselineDetail, ProjectBaselineDetailAPI, ProjectHome, ProjectConfig, \
    ProjectConfigAPI, ProjectExpenseListAPI, ProjectWorkList, ProjectActivities, \
    ProjectActivitiesListAPI, ProjectCommentListAPI, ProjectActivitiesCommentDetail, ProjectCommentDetailFlowsAPI, \
    ProjectTaskList, ProjectTaskListAllAPI

urlpatterns = [
    # project
    path('home', ProjectHome.as_view(), name='ProjectHome'),
    path('list', ProjectList.as_view(), name='ProjectList'),
    path('list-api', ProjectListAPI.as_view(), name='ProjectListAPI'),
    path('create', ProjectCreate.as_view(), name='ProjectCreate'),
    path('create-api', ProjectCreateAPI.as_view(), name='ProjectCreateAPI'),
    path('detail/<str:pk>', ProjectDetail.as_view(), name='ProjectDetail'),
    path('detail-api/<str:pk>', ProjectDetailAPI.as_view(), name='ProjectDetailAPI'),
    path('update/<str:pk>', ProjectEdit.as_view(), name='ProjectEdit'),
    path('update-api/<str:pk>', ProjectEditAPI.as_view(), name='ProjectEditAPI'),
    path('update-order-api/<str:pk_pj>', ProjectUpdateOrderAPI.as_view(), name='ProjectUpdateOrderAPI'),
    # project group
    path('group/list-api', ProjectGroupListAPI.as_view(), name='ProjectGroupListAPI'),
    path('group/list-dd-api', ProjectGroupDDListAPI.as_view(), name='ProjectGroupDDListAPI'),
    path('group/create-api', ProjectCreateGroupAPI.as_view(), name='ProjectCreateGroupAPI'),
    path('group/detail-api/<str:pk>', ProjectGroupDetailAPI.as_view(), name='ProjectGroupDetailAPI'),
    # project work
    path('work/list', ProjectWorkList.as_view(), name='ProjectWorkList'),
    path('work/list-api', ProjectWorkListAPI.as_view(), name='ProjectWorkListAPI'),
    path('work/create-api', ProjectWorkCreateAPI.as_view(), name='ProjectWorkCreateAPI'),
    path('work/detail-api/<str:pk>', ProjectWorkDetailAPI.as_view(), name='ProjectWorkDetailAPI'),
    # project member
    path('<str:pk_pj>/member/add-api', ProjectMemberAddAPI.as_view(), name='ProjectMemberAddAPI'),
    path(
        '<str:pk_pj>/member/delete-api/<str:pk_member>', ProjectMemberDetailAPI.as_view(), name='ProjectMemberDeleteAPI'
    ),
    path(
        '<str:pk_pj>/member/detail-api/<str:pk_member>', ProjectMemberDetailAPI.as_view(), name='ProjectMemberDetailAPI'
    ),
    path(
        '<str:pk_pj>/member/update-api/<str:pk_member>', ProjectMemberDetailAPI.as_view(), name='ProjectMemberUpdateAPI'
    ),
    # project task
    path('task/list', ProjectTaskList.as_view(), name='ProjectTaskList'),
    path('task/list/api', ProjectTaskListAPI.as_view(), name='ProjectTaskListAPI'),
    path('task/list-all/api', ProjectTaskListAllAPI.as_view(), name='ProjectTaskListAllAPI'),
    path('task-link/<str:pk>', ProjectTaskDetailAPI.as_view(), name='ProjectTaskDetailAPI'),

    # project work expense list
    path('work-expense-list', ProjectWorkExpenseAPI.as_view(), name='ProjectWorkExpenseAPI'),
    path('project-expense-list', ProjectExpenseListAPI.as_view(), name='ProjectExpenseListAPI'),

    # project baseline
    path('baseline/list-api', ProjectListBaselineAPI.as_view(), name='ProjectListBaselineAPI'),
    path('baseline/detail/baseline-version/<str:pk>', ProjectBaselineDetail.as_view(), name='ProjectBaselineDetail'),
    path(
        'detail/baseline-version/detail-api/<str:pk>', ProjectBaselineDetailAPI.as_view(),
        name='ProjectBaselineDetailAPI'
    ),
    # project config
    path('config', ProjectConfig.as_view(), name='ProjectConfig'),
    path('config-api', ProjectConfigAPI.as_view(), name='ProjectConfigAPI'),

    # project activities
    path('activities/list', ProjectActivities.as_view(), name='ProjectActivities'),
    path(
        'activities/comment/detail/<str:pk>', ProjectActivitiesCommentDetail.as_view(),
        name='ProjectActivitiesCommentDetail'
    ),
    path('activities/list-api', ProjectActivitiesListAPI.as_view(), name='ProjectActivitiesListAPI'),
    path('activities/comment-api', ProjectCommentListAPI.as_view(), name='ProjectCommentListAPI'),
    path(
        'activities/comment/detail-api/<str:pk>', ProjectCommentDetailFlowsAPI.as_view(), name='ProjectCommentDetailAPI'
    ),

]
