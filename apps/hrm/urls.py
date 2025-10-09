from django.urls import path, include

urlpatterns = [
    # employee HRM page
    path('employee-data/', include('apps.hrm.employee.urls')),
    # attendance HRM page
    path('attendance/', include('apps.hrm.attendance.urls')),
    # absenceexplanation page
    path('absenceexplanation/', include('apps.hrm.absenceexplanation.urls')),
    path('overtime-request/', include('apps.hrm.overtimerequest.urls')),
    path('payroll/', include('apps.hrm.payroll.urls')),
]
