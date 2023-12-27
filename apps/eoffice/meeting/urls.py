from django.urls import path

from apps.eoffice.meeting.views import (
    MeetingScheduleList, MeetingScheduleCreate, MeetingScheduleListAPI,
    MeetingScheduleDetail, MeetingScheduleDetailAPI
)

urlpatterns = [
    path('meetings-schedule', MeetingScheduleList.as_view(), name='MeetingScheduleList'),
    path('meeting-schedule/create', MeetingScheduleCreate.as_view(), name='MeetingScheduleCreate'),
    path('meetings-schedule/api', MeetingScheduleListAPI.as_view(), name='MeetingScheduleListAPI'),
    path('meeting-schedule/detail/<str:pk>', MeetingScheduleDetail.as_view(), name='MeetingScheduleDetail'),
    path('meeting-schedule/api/<str:pk>', MeetingScheduleDetailAPI.as_view(), name='MeetingScheduleDetailAPI'),
]
