from django.urls import path

from .views import ContractTemplateList, ContractTemplateCreate, ContractTemplateCreateAPI, \
    ContractTemplateListAPI, ContractTemplateDetail, ContractTemplateDetailAPI, ContractTemplateUpdate, \
    ContractTemplateUpdateAPI, ContractTemplateConfigAPI

urlpatterns = [
    path('list', ContractTemplateList.as_view(), name='ContractTemplateList'),
    path('list/api', ContractTemplateListAPI.as_view(), name='ContractTemplateListAPI'),
    path('create', ContractTemplateCreate.as_view(), name='ContractTemplateCreate'),
    path('create/api', ContractTemplateCreateAPI.as_view(), name='ContractTemplateCreateAPI'),
    path('detail/<str:pk>', ContractTemplateDetail.as_view(), name='ContractTemplateDetail'),
    path('detail-api/<str:pk>', ContractTemplateDetailAPI.as_view(), name='ContractTemplateDetailAPI'),
    path('update/<str:pk>', ContractTemplateUpdate.as_view(), name='ContractTemplateUpdate'),
    path('update-api/<str:pk>', ContractTemplateUpdateAPI.as_view(), name='ContractTemplateUpdateAPI'),
    # config template contract
    path('template-list', ContractTemplateConfigAPI.as_view(), name='ContractTemplateConfigAPI'),
]
