from django.urls import path

from apps.hrm.employee.views import HRMEmployeeList, HRMEmployeeCreate, HRMEmployeeNotMapHRM

urlpatterns = [
    # employee HRM page
    path('hrm/employee-not-map-hrm', HRMEmployeeNotMapHRM.as_view(), name='HRMEmployeeNotMapHRMAPI'),
    path('hrm/employee-data/list', HRMEmployeeList.as_view(), name='HRMEmployeeList'),
    path('hrm/employee-data/create', HRMEmployeeCreate.as_view(), name='HRMEmployeeCreate'),
]
