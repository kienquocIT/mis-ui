from django.urls import path

from apps.eoffice.leave.views import LeaveConfigDetail, LeaveTypeConfigAPI, WorkingCalendarConfig, WorkingYearConfig, \
    WorkingHolidayConfig, WorkingCalendarConfigAPI, LeaveRequestList, LeaveRequestListAPI, LeaveRequestCreate, \
    LeaveRequestCreateAPI, LeaveAvailableList, LeaveAvailableListAPI, LeaveRequestDetail, LeaveRequestDetailAPI, \
    LeaveRequestEdit, LeaveRequestEditAPI, LeaveAvailableHistoryAPI

urlpatterns = [
    path('config', LeaveConfigDetail.as_view(), name='LeaveConfigDetail'),
    # leave type
    path('config/leave-type/create', LeaveTypeConfigAPI.as_view(), name='LeaveTypeCreate'),
    path('config/leave-type/detail/<str:pk>', LeaveTypeConfigAPI.as_view(), name='LeaveConfigDetail'),
    # working calendar
    path('working-calendar/config', WorkingCalendarConfig.as_view(), name='WorkingCalendarConfig'),
    path('working-calendar/config/api', WorkingCalendarConfigAPI.as_view(), name='WorkingCalendarConfigAPI'),
    path('working-calendar/year/create', WorkingYearConfig.as_view(), name='WorkingYearCreate'),
    path('working-calendar/year/detail/<str:pk>', WorkingYearConfig.as_view(), name='WorkingYearDetail'),
    path('working-calendar/holiday/create', WorkingHolidayConfig.as_view(), name='WorkingHolidayCreate'),
    path('working-calendar/holiday/detail/<str:pk>', WorkingHolidayConfig.as_view(), name='WorkingHolidayDetail'),
    # leave request
    path('requests/list', LeaveRequestList.as_view(), name='LeaveRequestList'),
    path('requests/list-api', LeaveRequestListAPI.as_view(), name='LeaveRequestListAPI'),
    path('requests/create', LeaveRequestCreate.as_view(), name='LeaveRequestCreate'),
    path('requests/create-api', LeaveRequestCreateAPI.as_view(), name='LeaveRequestCreateAPI'),
    path('requests/detail/<str:pk>', LeaveRequestDetail.as_view(), name='LeaveRequestDetail'),
    path('requests/detail-api/<str:pk>', LeaveRequestDetailAPI.as_view(), name='LeaveRequestDetailAPI'),
    path('requests/update/<str:pk>', LeaveRequestEdit.as_view(), name='LeaveRequestEdit'),
    path('requests/edit-api/<str:pk>', LeaveRequestEditAPI.as_view(), name='LeaveRequestEditAPI'),
    # leave available list
    path('requests/available-list', LeaveAvailableList.as_view(), name='LeaveAvailableList'),
    path('requests/available-list/api', LeaveAvailableListAPI.as_view(), name='LeaveAvailableListAPI'),
    path('requests/available-history/api', LeaveAvailableHistoryAPI.as_view(), name='LeaveAvailableHistoryAPI'),
]
