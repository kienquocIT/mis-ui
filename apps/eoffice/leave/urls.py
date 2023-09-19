from django.urls import path

from apps.eoffice.leave.views import LeaveConfigDetail

urlpatterns = [
    path('config', LeaveConfigDetail.as_view(), name='LeaveConfigDetail'),
]
