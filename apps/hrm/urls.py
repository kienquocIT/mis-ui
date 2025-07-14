from django.urls import path, include

urlpatterns = [
    # employee HRM page
    path('employee-data/', include('apps.hrm.employee.urls')),
    # attandance HRM page
    path('attandance-data/', include('apps.hrm.attandance.urls')),
]
