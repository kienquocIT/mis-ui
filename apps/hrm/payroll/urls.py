from django.urls import path

from .views import (
    PayrollConfigDetail, PayrollConfigDetailAPI, PayrollTemplateList, PayrollTemplateListAPI,
    PayrollTemplateDetail, PayrollTemplateCreate, PayrollTemplateUpdate, PayrollTemplateDetailAPI,
)
from .views.template_attribute import PayrollTemplAttrList, PayrollTemplAttrListAPI, PayrollTemplateAttributeDetailAPI

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
    path(
        'template/attribute/detail-api/<str:pk>', PayrollTemplateAttributeDetailAPI.as_view(),
        name='PayrollTemplateAttributeDetailAPI'
    ),
]
