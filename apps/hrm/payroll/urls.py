from django.urls import path

from apps.hrm.payroll.views import PayrollConfigDetail, PayrollConfigDetailAPI

urlpatterns = [
    path('payrollconfig/config', PayrollConfigDetail.as_view(), name='PayrollConfigDetail'),
    path('payrollconfig/config/api', PayrollConfigDetailAPI.as_view(), name='PayrollConfigDetailAPI'),
]
