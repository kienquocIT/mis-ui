from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    DefaultAccountDeterminationList, DefaultAccountDeterminationListAPI, WarehouseAccountDeterminationListAPI,
    ProductTypeAccountDeterminationListAPI, ProductAccountDeterminationListAPI
)

urlpatterns = [
    path('chart-of-accounts/list', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/list/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
    path('default-account-determination/list', DefaultAccountDeterminationList.as_view(), name='DefaultAccountDeterminationList'),
    path('default-account-determination/list/api', DefaultAccountDeterminationListAPI.as_view(), name='DefaultAccountDeterminationListAPI'),
    path('warehouse-account-determination/list/api', WarehouseAccountDeterminationListAPI.as_view(), name='WarehouseAccountDeterminationListAPI'),
    path('product-type-account-determination/list/api', ProductTypeAccountDeterminationListAPI.as_view(), name='ProductTypeAccountDeterminationListAPI'),
    path('product-account-determination/list/api', ProductAccountDeterminationListAPI.as_view(), name='ProductAccountDeterminationListAPI'),
]
