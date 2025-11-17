from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    AccountDeterminationList, AccountDeterminationListAPI, WarehouseAccountDeterminationListAPI,
    ProductTypeAccountDeterminationListAPI, ProductAccountDeterminationListAPI, WarehouseAccountDeterminationDetailAPI,
    ProductTypeAccountDeterminationDetailAPI, ProductAccountDeterminationDetailAPI, AccountDeterminationDetailAPI,
    InitialBalanceList, InitialBalanceListAPI, DimensionDefinitionList, DimensionDefinitionListAPI,
    DimensionDefinitionDetailAPI, DimensionValueList, DimensionDefinitionWithValueAPI, DimensionValueListAPI,
    DimensionValueDetailAPI, DimensionSyncConfigApplicationListAPI, DimensionSyncConfigList, DimensionSyncConfigListAPI,
    DimensionSyncConfigDetailAPI, DimensionListForAccountingAccountAPI, DimensionAccountList, DimensionAccountListAPI,
    DimensionAccountDetailAPI, DimensionSplitTemplateList, DimensionSplitTemplateListAPI,
    DimensionSplitTemplateDetailAPI
)

urlpatterns = [
    path('chart-of-accounts/list', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/list/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
] + [
    path('account-determination/list', AccountDeterminationList.as_view(), name='AccountDeterminationList'),
    path('account-determination/list/api', AccountDeterminationListAPI.as_view(), name='AccountDeterminationListAPI'),
    path('account-determination/detail/api/<str:pk>', AccountDeterminationDetailAPI.as_view(), name='AccountDeterminationDetailAPI'),
] + [
    path('warehouse-account-determination/list/api', WarehouseAccountDeterminationListAPI.as_view(), name='WarehouseAccountDeterminationListAPI'),
    path('warehouse-account-determination/detail/api/<str:pk>', WarehouseAccountDeterminationDetailAPI.as_view(), name='WarehouseAccountDeterminationDetailAPI'),
] + [
    path('product-type-account-determination/list/api', ProductTypeAccountDeterminationListAPI.as_view(), name='ProductTypeAccountDeterminationListAPI'),
    path('product-type-account-determination/detail/api/<str:pk>', ProductTypeAccountDeterminationDetailAPI.as_view(), name='ProductTypeAccountDeterminationDetailAPI'),
] + [
    path('product-account-determination/list/api', ProductAccountDeterminationListAPI.as_view(), name='ProductAccountDeterminationListAPI'),
    path('product-account-determination/detail/api/<str:pk>', ProductAccountDeterminationDetailAPI.as_view(), name='ProductAccountDeterminationDetailAPI'),
    # initial balance
] + [
    path('initial-balance/list', InitialBalanceList.as_view(), name='InitialBalanceList'),
    path('initial-balance/list/api', InitialBalanceListAPI.as_view(), name='InitialBalanceListAPI'),
]

urlpatterns += [
    # view url
    path('dimension-definition/list', DimensionDefinitionList.as_view(), name='DimensionDefinitionList'),
    path('dimension-value/list', DimensionValueList.as_view(), name='DimensionValueList'),
    path('dimension-sync-config/list', DimensionSyncConfigList.as_view(), name='DimensionSyncConfigList'),
    path('dimension-account/list', DimensionAccountList.as_view(), name='DimensionAccountList'),
    path('dimension-split-template/list', DimensionSplitTemplateList.as_view(), name='DimensionSplitTemplateList'),

    # api url
    path('dimension-definition/list/api', DimensionDefinitionListAPI.as_view(), name='DimensionDefinitionListAPI'),
    path('dimension-definition/detail/api/<str:pk>', DimensionDefinitionDetailAPI.as_view(), name='DimensionDefinitionDetailAPI'),
    path('dimension-definition-values/api/<str:pk>', DimensionDefinitionWithValueAPI.as_view(), name='DimensionDefinitionWithValueAPI'),
    path('dimension-value/list/api', DimensionValueListAPI.as_view(), name='DimensionValueListAPI'),
    path('dimension-value/detail/api/<str:pk>', DimensionValueDetailAPI.as_view(), name='DimensionValueDetailAPI'),
    path('dimension-sync-config/application-list/api', DimensionSyncConfigApplicationListAPI.as_view(), name='DimensionSyncConfigApplicationListAPI'),
    path('dimension-sync-config/list/api', DimensionSyncConfigListAPI.as_view(), name='DimensionSyncConfigListAPI'),
    path('dimension-sync-config/detail/api/<str:pk>', DimensionSyncConfigDetailAPI.as_view(), name='DimensionSyncConfigDetailAPI'),
    path('dimension-list-for-accounting-account/detail/api/<str:pk>', DimensionListForAccountingAccountAPI.as_view(), name='DimensionListForAccountingAccountAPI'),
    path('dimension-account/list/api', DimensionAccountListAPI.as_view(), name='DimensionAccountListAPI'),
    path('dimension-account/detail/api/<str:pk>', DimensionAccountDetailAPI.as_view(), name='DimensionAccountDetailAPI'),
    path('dimension-split-template/list/api', DimensionSplitTemplateListAPI.as_view(), name='DimensionSplitTemplateListAPI'),
    path('dimension-split-template/detail/api/<str:pk>', DimensionSplitTemplateDetailAPI.as_view(), name='DimensionSplitTemplateDetailAPI'),
]
