from django.urls import path

from apps.eoffice.meeting.views import MeetingScheduleList, MeetingScheduleCreate, MeetingScheduleListAPI

urlpatterns = [
    path('meetings-schedule', MeetingScheduleList.as_view(), name='MeetingScheduleList'),
    path('meeting-schedule/create', MeetingScheduleCreate.as_view(), name='MeetingScheduleCreate'),
    path('meetings-schedule/api', MeetingScheduleListAPI.as_view(), name='MeetingScheduleListAPI'),
]
