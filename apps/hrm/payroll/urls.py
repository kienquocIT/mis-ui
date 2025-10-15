from django.urls import path

from .views import PayrollTemplateList, PayrollTemplateListAPI, PayrollTemplateDetail, PayrollTemplAttrList, \
    PayrollTemplateCreate, PayrollTemplAttrListAPI

urlpatterns = [
    # HRM payroll template
    path('template/list', PayrollTemplateList.as_view(), name='PayrollTemplateList'),
    path('template/list/api', PayrollTemplateListAPI.as_view(), name='PayrollTemplateListAPI'),
    path('template/create', PayrollTemplateCreate.as_view(), name='PayrollTemplateCreate'),
    path('template/detail/<str:pk>', PayrollTemplateDetail.as_view(), name='PayrollTemplateDetail'),
    path('template/attribute/list', PayrollTemplAttrList.as_view(), name='PayrollTemplAttrList'),
    path('template/attribute/list-api', PayrollTemplAttrListAPI.as_view(), name='PayrollTemplAttrListAPI'),
]