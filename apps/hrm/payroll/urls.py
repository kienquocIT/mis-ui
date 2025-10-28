from django.urls import path

from .views import PayrollConfigDetail, PayrollConfigDetailAPI, PayrollTemplateList, PayrollTemplateListAPI, PayrollTemplateDetail, PayrollTemplAttrList, \
    PayrollTemplateCreate, PayrollTemplAttrListAPI, PayrollTemplateUpdate, PayrollTemplateDetailAPI
from apps.hrm.payroll.views.payroll_attribute import PayrollAttributeList, PayrollAttributeListAPI

urlpatterns = [
    path('payrollconfig/config', PayrollConfigDetail.as_view(), name='PayrollConfigDetail'),
    path('payrollconfig/config/api', PayrollConfigDetailAPI.as_view(), name='PayrollConfigDetailAPI'),
    # HRM payroll template
    path('template/list', PayrollTemplateList.as_view(), name='PayrollTemplateList'),
    path('template/list/api', PayrollTemplateListAPI.as_view(), name='PayrollTemplateListAPI'),
    path('template/create', PayrollTemplateCreate.as_view(), name='PayrollTemplateCreate'),
    path('template/detail/<str:pk>', PayrollTemplateDetail.as_view(), name='PayrollTemplateDetail'),
    path('template/detail/api/<str:pk>', PayrollTemplateDetailAPI.as_view(), name='PayrollTemplateDetailAPI'),
    path('template/update/<str:pk>', PayrollTemplateUpdate.as_view(), name='PayrollTemplateUpdate'),
    path('template/attribute/list', PayrollTemplAttrList.as_view(), name='PayrollTemplAttrList'),
    path('template/attribute/list-api', PayrollTemplAttrListAPI.as_view(), name='PayrollTemplAttrListAPI'),

    path('payrollattribute/list', PayrollAttributeList.as_view(), name='PayrollAttributeList'),
    path('payrollattribute/list/api', PayrollAttributeListAPI.as_view(), name='PayrollAttributeListAPI'),
]
