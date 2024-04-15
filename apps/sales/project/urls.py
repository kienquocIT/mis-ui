from django.urls import path

from apps.sales.project.views import ProjectList, ProjectCreate, ProjectCreateAPI, ProjectListAPI, ProjectDetail, \
    ProjectDetailAPI, ProjectEdit, ProjectEditAPI, ProjectCreateGroupAPI, ProjectWorkCreateAPI, ProjectGroupListAPI, \
    ProjectWorkListAPI

urlpatterns = [
    # project
    path('list', ProjectList.as_view(), name='ProjectList'),
    path('list-api', ProjectListAPI.as_view(), name='ProjectListAPI'),
    path('create', ProjectCreate.as_view(), name='ProjectCreate'),
    path('create-api', ProjectCreateAPI.as_view(), name='ProjectCreateAPI'),
    path('detail/<str:pk>', ProjectDetail.as_view(), name='ProjectDetail'),
    path('detail-api/<str:pk>', ProjectDetailAPI.as_view(), name='ProjectDetailAPI'),
    path('update/<str:pk>', ProjectEdit.as_view(), name='ProjectEdit'),
    path('update-api/<str:pk>', ProjectEditAPI.as_view(), name='ProjectEditAPI'),
    # project group
    path('group/list-api', ProjectGroupListAPI.as_view(), name='ProjectGroupListAPI'),
    path('group/create-api', ProjectCreateGroupAPI.as_view(), name='ProjectCreateGroupAPI'),
    # project work
    path('work/list-api', ProjectWorkListAPI.as_view(), name='ProjectWorkListAPI'),
    path('work/create-api', ProjectWorkCreateAPI.as_view(), name='ProjectWorkCreateAPI'),

]
