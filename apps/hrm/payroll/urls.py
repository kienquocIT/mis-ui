from django.urls import path

from apps.hrm.payroll.views import PayrollConfigList, PayrollConfigListAPI

urlpatterns = [
    path('payrollconfig/list', PayrollConfigList.as_view(), name='PayrollConfigList'),
    path('payrollconfig/list/api', PayrollConfigListAPI.as_view(), name='PayrollConfigListAPI'),
]
