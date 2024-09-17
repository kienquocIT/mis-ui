from django.urls import path

from apps.sales.contract.views import ContractApprovalCreate, ContractApprovalListAPI, ContractApprovalList,\
    ContractApprovalDetail, ContractApprovalDetailAPI, ContractApprovalUpdate

urlpatterns = [
    path('lists', ContractApprovalList.as_view(), name='ContractApprovalList'),
    path('api/lists', ContractApprovalListAPI.as_view(), name='ContractApprovalListAPI'),
    path('create', ContractApprovalCreate.as_view(), name='ContractApprovalCreate'),
    path('detail/<str:pk>', ContractApprovalDetail.as_view(), name='ContractApprovalDetail'),
    path('detail-api/<str:pk>', ContractApprovalDetailAPI.as_view(), name='ContractApprovalDetailAPI'),
    path('update/<str:pk>', ContractApprovalUpdate.as_view(), name='ContractApprovalUpdate'),
]
