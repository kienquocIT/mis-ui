from django.urls import path

from apps.core.hr.views import (
    EmployeeList, EmployeeCreate, EmployeeListAPI, GroupDetailAPI, GroupLevelList,
    GroupLevelListAPI, GroupList, GroupListAPI, GroupCreate, GroupUpdate, GroupDetail,
    EmployeeDetailAPI, EmployeeDetail, EmployeeUpdate, EmployeeCompanyListAPI, EmployeeUploadAvatarAPI,
    GroupLevelDetailAPI, RoleUpdateView, RoleUpdateAPI,
    PlanAppGetAppListAPI, PlanSummaryListAPI, ApplicationSummaryListAPI, PermissionSummaryListAPI, EmployeeListAllAPI,
    EmployeeAdminCompanyAPI,
)
from apps.core.hr.views import (
    RoleList, RoleListAPI, RoleCreate, RoleDetail, RoleDetailAPI,
)

urlpatterns = [
    path('employee', EmployeeList.as_view(), name='EmployeeList'),
    path('employee/api', EmployeeListAPI.as_view(), name='EmployeeListAPI'),
    path('employee/all/api', EmployeeListAllAPI.as_view(), name='EmployeeListAllAPI'),
    path('employee/create', EmployeeCreate.as_view(), name='EmployeeCreate'),
    path('employee/detail/<str:pk>', EmployeeDetail.as_view(), name='EmployeeDetail'),
    path(
        'employee/detail/<str:pk>/upload-avatar/api', EmployeeUploadAvatarAPI.as_view(), name='EmployeeUploadAvatarAPI'
    ),
    path('employee/detail/<str:pk>/app/all', PlanAppGetAppListAPI.as_view(), name='PlanAppGetAppListAPI'),
    path('employee/detail/<str:pk>/app/summary', ApplicationSummaryListAPI.as_view(), name='ApplicationSummaryListAPI'),
    path('employee/detail/<str:pk>/plan/summary', PlanSummaryListAPI.as_view(), name='PlanSummaryListAPI'),
    path(
        'employee/detail/<str:pk>/permissions/summary', PermissionSummaryListAPI.as_view(),
        name='PermissionSummaryListAPI'
    ),
    path('employee/update/<str:pk>', EmployeeUpdate.as_view(), name='EmployeeUpdate'),
    path('employee/<str:pk>', EmployeeDetailAPI.as_view(), name='EmployeeDetailAPI'),
    # path('employee/company/<str:company_id>', EmployeeCompanyListAPI.as_view(), name='EmployeeCompanyListAPI'),
    path('employee-company', EmployeeCompanyListAPI.as_view(), name='EmployeeCompanyListAPI'),
    path('employee-admin-company', EmployeeAdminCompanyAPI.as_view(), name='EmployeeAdminCompanyAPI'),

    path('role', RoleList.as_view(), name='RoleList'),
    path('role/api', RoleListAPI.as_view(), name='RoleListAPI'),
    path('role/create', RoleCreate.as_view(), name='RoleCreate'),
    path('role/update/<str:pk>', RoleUpdateView.as_view(), name='RoleUpdateView'),
    path('role/update/<str:pk>/api', RoleUpdateAPI.as_view(), name='RoleUpdateAPI'),
    path('role/detail/<str:pk>', RoleDetail.as_view(), name='RoleDetail'),
    path('role/<str:pk>', RoleDetailAPI.as_view(), name='RoleDetailAPI'),

    path('level', GroupLevelList.as_view(), name='GroupLevelList'),
    path('level/api', GroupLevelListAPI.as_view(), name='GroupLevelListAPI'),
    path('level/<str:pk>', GroupLevelDetailAPI.as_view(), name='GroupLevelDetailAPI'),
    path('group', GroupList.as_view(), name='GroupList'),
    path('group/api', GroupListAPI.as_view(), name='GroupListAPI'),
    path('group/create', GroupCreate.as_view(), name='GroupCreate'),
    path('group/<str:pk>', GroupDetailAPI.as_view(), name='GroupDetailAPI'),
    path('group/detail/<str:pk>', GroupDetail.as_view(), name='GroupDetail'),
    path('group/update/<str:pk>', GroupUpdate.as_view(), name='GroupUpdate'),
]
