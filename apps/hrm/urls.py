from django.urls import path

from apps.hrm.employee.views import HRMEmployeeList, HRMEmployeeCreate

urlpatterns = [
    # employee HRM page
    path('hrm/employee-data/list', HRMEmployeeList.as_view(), name='HRMEmployeeList'),
    path('hrm/employee-data/create', HRMEmployeeCreate.as_view(), name='HRMEmployeeCreate'),
]
