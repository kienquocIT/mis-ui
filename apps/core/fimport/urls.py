from django.urls import path

from apps.core.fimport.views import (
    CoreAccountUserImportAPI,
    FImportListView, FImportCreateView, HrGroupLevelImportAPI, HrGroupImportAPI,
    HrRoleImportAPI, HrEmployeeImportAPI,
)

urlpatterns = [
    path('list', FImportListView.as_view(), name='FImportListView'),
    path('create', FImportCreateView.as_view(), name='FImportCreateView'),
    # core
    path('core/account/user', CoreAccountUserImportAPI.as_view(), name='CoreAccountUserImportAPI'),
    # hr
    path('hr/group-level', HrGroupLevelImportAPI.as_view(), name='HrGroupLevelImportAPI'),
    path('hr/group', HrGroupImportAPI.as_view(), name='HrGroupImportAPI'),
    path('hr/role', HrRoleImportAPI.as_view(), name='HrRoleImportAPI'),
    path('hr/employee', HrEmployeeImportAPI.as_view(), name='HrEmployeeImportAPI'),
]
