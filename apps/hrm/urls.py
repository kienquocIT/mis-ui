from django.urls import path, include

urlpatterns = [
    # employee HRM page
    path('employee-data/', include('apps.hrm.employee.urls')),
    # attendance HRM page
    path('attendance/', include('apps.hrm.attendance.urls')),
]
