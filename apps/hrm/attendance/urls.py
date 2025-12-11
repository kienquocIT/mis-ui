from django.urls import path

from apps.hrm.attendance.views import ShiftMasterDataList, ShiftMasterDataListAPI, ShiftMasterDataDetailAPI, \
    HRMAttendanceList, ShiftAssignmentList, ShiftAssignmentListAPI, AttendanceListAPI, DeviceIntegrateEmployeeList, \
    DeviceIntegrateEmployeeListAPI, DeviceIntegrateEmployeeDetailAPI, AttendanceDeviceList, AttendanceDeviceListAPI, \
    AttendanceDeviceDetailAPI, ShiftImportAPI, ShiftAssignmentConfigDetailAPI

urlpatterns = [
    path('shift/list', ShiftMasterDataList.as_view(), name='ShiftMasterDataList'),
    path('shift/list/api', ShiftMasterDataListAPI.as_view(), name='ShiftMasterDataListAPI'),
    path('shift/list/api/<str:pk>', ShiftMasterDataDetailAPI.as_view(), name='ShiftMasterDataDetailAPI'),
    path('shift/import/api', ShiftImportAPI.as_view(), name='ShiftImportAPI'),

    # shift assignment
    path('shift-assignment-config', ShiftAssignmentConfigDetailAPI.as_view(), name='ShiftAssignmentConfigDetailAPI'),
    path('shift-assignment/list', ShiftAssignmentList.as_view(), name='ShiftAssignmentList'),
    path('shift-assignment/api/list', ShiftAssignmentListAPI.as_view(), name='ShiftAssignmentListAPI'),
    path('attendance/list', HRMAttendanceList.as_view(), name='HRMAttendanceList'),

    # attendance
    path('attendance/list/api', AttendanceListAPI.as_view(), name='AttendanceListAPI'),

    # device integrate
    path('attendance-device/list', AttendanceDeviceList.as_view(), name='AttendanceDeviceList'),
    path('attendance-device/api/list', AttendanceDeviceListAPI.as_view(), name='AttendanceDeviceListAPI'),
    path(
        'attendance-device/detail-api/<str:pk>',
        AttendanceDeviceDetailAPI.as_view(),
        name='AttendanceDeviceDetailAPI'
    ),
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
