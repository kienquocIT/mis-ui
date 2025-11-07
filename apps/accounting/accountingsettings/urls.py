from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    AccountDeterminationList, AccountDeterminationListAPI, WarehouseAccountDeterminationListAPI,
    ProductTypeAccountDeterminationListAPI, ProductAccountDeterminationListAPI, WarehouseAccountDeterminationDetailAPI,
    ProductTypeAccountDeterminationDetailAPI, ProductAccountDeterminationDetailAPI, AccountDeterminationDetailAPI
)

urlpatterns = [
    path('chart-of-accounts/list', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/list/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
    path('account-determination/list', AccountDeterminationList.as_view(), name='AccountDeterminationList'),
    path('account-determination/list/api', AccountDeterminationListAPI.as_view(), name='AccountDeterminationListAPI'),
    path('account-determination/detail/api/<str:pk>', AccountDeterminationDetailAPI.as_view(), name='AccountDeterminationDetailAPI'),
    path('warehouse-account-determination/list/api', WarehouseAccountDeterminationListAPI.as_view(), name='WarehouseAccountDeterminationListAPI'),
    path('warehouse-account-determination/detail/api/<str:pk>', WarehouseAccountDeterminationDetailAPI.as_view(), name='WarehouseAccountDeterminationDetailAPI'),
    path('product-type-account-determination/list/api', ProductTypeAccountDeterminationListAPI.as_view(), name='ProductTypeAccountDeterminationListAPI'),
    path('product-type-account-determination/detail/api/<str:pk>', ProductTypeAccountDeterminationDetailAPI.as_view(), name='ProductTypeAccountDeterminationDetailAPI'),
    path('product-account-determination/list/api', ProductAccountDeterminationListAPI.as_view(), name='ProductAccountDeterminationListAPI'),
    path('product-account-determination/detail/api/<str:pk>', ProductAccountDeterminationDetailAPI.as_view(), name='ProductAccountDeterminationDetailAPI'),
]
