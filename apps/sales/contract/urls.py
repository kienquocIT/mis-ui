from django.urls import path

from apps.sales.contract.views import ContractCreate, ContractListAPI, ContractList, ContractDetail, \
    ContractDetailAPI, ContractUpdate

urlpatterns = [
    path('lists', ContractList.as_view(), name='ContractList'),
    path('api/lists', ContractListAPI.as_view(), name='ContractListAPI'),
    path('create', ContractCreate.as_view(), name='ContractCreate'),
    path('detail/<str:pk>', ContractDetail.as_view(), name='ContractDetail'),
    path('detail-api/<str:pk>', ContractDetailAPI.as_view(), name='ContractDetailAPI'),
    path('update/<str:pk>', ContractUpdate.as_view(), name='ContractUpdate'),
]
