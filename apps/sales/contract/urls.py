from django.urls import path

from apps.sales.contract.views import ContractCreate, ContractListAPI, ContractList

urlpatterns = [
    path('lists', ContractList.as_view(), name='ContractList'),
    path('api/lists', ContractListAPI.as_view(), name='ContractListAPI'),
    path('create', ContractCreate.as_view(), name='ContractCreate'),
]
