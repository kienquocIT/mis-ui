from django.urls import path

from apps.hrm.payroll.views import PayrollConfigDetail, PayrollConfigDetailAPI
from apps.hrm.payroll.views.payroll_attribute import PayrollAttributeList, PayrollAttributeListAPI

urlpatterns = [
    path('payrollconfig/config', PayrollConfigDetail.as_view(), name='PayrollConfigDetail'),
    path('payrollconfig/config/api', PayrollConfigDetailAPI.as_view(), name='PayrollConfigDetailAPI'),

    path('payrollattribute/list', PayrollAttributeList.as_view(), name='PayrollAttributeList'),
    path('payrollattribute/list/api', PayrollAttributeListAPI.as_view(), name='PayrollAttributeListAPI'),
]
