from django.urls import path

from apps.hrm.attendance.views import ShiftMasterDataList, ShiftMasterDataListAPI, ShiftMasterDataDetailAPI, \
    HRMAttendanceList, ShiftAssignmentList, ShiftAssignmentListAPI, AttendanceListAPI, DeviceIntegrateEmployeeList, \
    DeviceIntegrateEmployeeListAPI, DeviceIntegrateEmployeeDetailAPI

urlpatterns = [
    path('shift/list', ShiftMasterDataList.as_view(), name='ShiftMasterDataList'),
    path('shift/list/api', ShiftMasterDataListAPI.as_view(), name='ShiftMasterDataListAPI'),
    path('shift/list/api/<str:pk>', ShiftMasterDataDetailAPI.as_view(), name='ShiftMasterDataDetailAPI'),

    # shift assignment
    path('shift-assignment/list', ShiftAssignmentList.as_view(), name='ShiftAssignmentList'),
    path('shift-assignment/api/list', ShiftAssignmentListAPI.as_view(), name='ShiftAssignmentListAPI'),
    path('attendance/list', HRMAttendanceList.as_view(), name='HRMAttendanceList'),

    # attendance
    path('attendance/list/api', AttendanceListAPI.as_view(), name='AttendanceListAPI'),

    # device integrate
    path('device-integrate-employee/list', DeviceIntegrateEmployeeList.as_view(), name='DeviceIntegrateEmployeeList'),
    path(
        'device-integrate-employee/api/list',
        DeviceIntegrateEmployeeListAPI.as_view(),
        name='DeviceIntegrateEmployeeListAPI'
    ),
    path(
        'device-integrate-employee/detail-api/<str:pk>',
        DeviceIntegrateEmployeeDetailAPI.as_view(),
        name='DeviceIntegrateEmployeeDetailAPI'
    ),
]
