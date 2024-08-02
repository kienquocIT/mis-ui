from django.urls import path

from apps.sales.contract.views import ContractCreate

urlpatterns = [
    path('create', ContractCreate.as_view(), name='ContractCreate'),
]