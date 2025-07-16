from django.urls import path

from apps.hrm.attendance.views import ShiftMasterDataList, ShiftMasterDataListAPI, ShiftMasterDataDetailAPI, \
    HRMAttendanceList

urlpatterns = [
    path('shift/list', ShiftMasterDataList.as_view(), name='ShiftMasterDataList'),
    path('shift/list/api', ShiftMasterDataListAPI.as_view(), name='ShiftMasterDataListAPI'),
    path('shift/list/api/<str:pk>', ShiftMasterDataDetailAPI.as_view(), name='ShiftMasterDataDetailAPI'),
    path('attendance/list', HRMAttendanceList.as_view(), name='HRMAttendanceList'),
]
