from django.urls import path

from apps.eoffice.meeting.views import (
    MeetingScheduleList, MeetingScheduleCreate, MeetingScheduleListAPI,
    MeetingScheduleDetail, MeetingScheduleDetailAPI, MeetingZoomConfigListAPI,
    MeetingZoomConfigDetailAPI, MeetingZoomConfigList, MeetingScheduleCheckAPI
)

urlpatterns = [
    path('meetings-schedule', MeetingScheduleList.as_view(), name='MeetingScheduleList'),
    path('meeting-schedule/create', MeetingScheduleCreate.as_view(), name='MeetingScheduleCreate'),
    path('meetings-schedule/api', MeetingScheduleListAPI.as_view(), name='MeetingScheduleListAPI'),
    path('meeting-schedule/detail/<str:pk>', MeetingScheduleDetail.as_view(), name='MeetingScheduleDetail'),
    path('meeting-schedule/api/<str:pk>', MeetingScheduleDetailAPI.as_view(), name='MeetingScheduleDetailAPI'),
    path('meetings-schedule/zoom-config', MeetingZoomConfigList.as_view(), name='MeetingZoomConfigList'),
    path(
        'meetings-schedule/meetingzoomconfig/api', MeetingZoomConfigListAPI.as_view(),
        name='MeetingZoomConfigListAPI'
    ),
    path(
        'meetings-schedule/meetingzoomconfig/api/<str:pk>', MeetingZoomConfigDetailAPI.as_view(),
        name='MeetingZoomConfigDetailAPI'
    ),
    path(
        'meetings-schedule/check-room/api', MeetingScheduleCheckAPI.as_view(),
        name='MeetingScheduleCheckAPI'
    ),
]
