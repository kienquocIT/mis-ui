from django.urls import path

from .views import PayrollTemplateList, PayrollTemplateListAPI, PayrollTemplateDetail, PayrollTemplateAttributeList, \
    PayrollTemplateCreate

urlpatterns = [
    # HRM payroll template
    path('template/list', PayrollTemplateList.as_view(), name='PayrollTemplateList'),
    path('template/list/api', PayrollTemplateListAPI.as_view(), name='PayrollTemplateListAPI'),
    path('template/create', PayrollTemplateCreate.as_view(), name='PayrollTemplateCreate'),
    path('template/detail/<str:pk>', PayrollTemplateDetail.as_view(), name='PayrollTemplateDetail'),
    path('template/attribute/list', PayrollTemplateAttributeList.as_view(), name='PayrollTemplateAttributeList'),
]