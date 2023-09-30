from django.urls import path

from apps.eoffice.leave.views import LeaveConfigDetail, LeaveTypeConfigAPI, WorkingCalendarConfig, WorkingYearConfig, \
    WorkingHolidayConfig, WorkingCalendarConfigAPI

urlpatterns = [
    path('config', LeaveConfigDetail.as_view(), name='LeaveConfigDetail'),
    path('config/leave-type/create', LeaveTypeConfigAPI.as_view(), name='LeaveTypeCreate'),
    path('config/leave-type/detail/<str:pk>', LeaveTypeConfigAPI.as_view(), name='LeaveConfigDetail'),
    path('working-calendar/config', WorkingCalendarConfig.as_view(), name='WorkingCalendarConfig'),
    path('working-calendar/config/api', WorkingCalendarConfigAPI.as_view(), name='WorkingCalendarConfigAPI'),
    path('working-calendar/year/create', WorkingYearConfig.as_view(), name='WorkingYearCreate'),
    path('working-calendar/year/detail/<str:pk>', WorkingYearConfig.as_view(), name='WorkingYearDetail'),
    path('working-calendar/holiday/create', WorkingHolidayConfig.as_view(), name='WorkingHolidayCreate'),
    path('working-calendar/holiday/detail/<str:pk>', WorkingHolidayConfig.as_view(), name='WorkingHolidayDetail'),
]
