from django.urls import path

from apps.core.fimport.views import FImportListView, FImportCreateView, HrGroupLevelImportAPI, HrGroupImportAPI

urlpatterns = [
    path('list', FImportListView.as_view(), name='FImportListView'),
    path('create', FImportCreateView.as_view(), name='FImportCreateView'),
    path('hr/group-level', HrGroupLevelImportAPI.as_view(), name='HrGroupLevelImportAPI'),
    path('hr/group', HrGroupImportAPI.as_view(), name='HrGroupImportAPI'),
]
