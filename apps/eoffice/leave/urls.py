from django.urls import path

from apps.eoffice.leave.views import LeaveConfigDetail, LeaveTypeConfigAPI

urlpatterns = [
    path('config', LeaveConfigDetail.as_view(), name='LeaveConfigDetail'),
    path('config/leave-type/create', LeaveTypeConfigAPI.as_view(), name='LeaveTypeCreate'),
    path('config/leave-type/detail/<str:pk>', LeaveTypeConfigAPI.as_view(), name='LeaveConfigDetail'),
]
