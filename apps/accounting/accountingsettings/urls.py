from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    DefaultAccountDeterminationList, DefaultAccountDeterminationListAPI, WarehouseAccountDeterminationListAPI,
    ProductTypeAccountDeterminationListAPI, ProductAccountDeterminationListAPI, WarehouseAccountDeterminationDetailAPI,
    ProductTypeAccountDeterminationDetailAPI, ProductAccountDeterminationDetailAPI,
    DefaultAccountDeterminationDetailAPI, DimensionDefinitionList, DimensionDefinitionListAPI,
    DimensionDefinitionDetailAPI, DimensionValueList, DimensionDefinitionWithValueAPI, DimensionValueListAPI,
    DimensionValueDetailAPI
)

urlpatterns = [
    path('chart-of-accounts/list', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/list/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
    path('default-account-determination/list', DefaultAccountDeterminationList.as_view(), name='DefaultAccountDeterminationList'),
    path('default-account-determination/list/api', DefaultAccountDeterminationListAPI.as_view(), name='DefaultAccountDeterminationListAPI'),
    path('default-account-determination/detail/api/<str:pk>', DefaultAccountDeterminationDetailAPI.as_view(), name='DefaultAccountDeterminationDetailAPI'),
    path('warehouse-account-determination/list/api', WarehouseAccountDeterminationListAPI.as_view(), name='WarehouseAccountDeterminationListAPI'),
    path('warehouse-account-determination/detail/api/<str:pk>', WarehouseAccountDeterminationDetailAPI.as_view(), name='WarehouseAccountDeterminationDetailAPI'),
    path('product-type-account-determination/list/api', ProductTypeAccountDeterminationListAPI.as_view(), name='ProductTypeAccountDeterminationListAPI'),
    path('product-type-account-determination/detail/api/<str:pk>', ProductTypeAccountDeterminationDetailAPI.as_view(), name='ProductTypeAccountDeterminationDetailAPI'),
    path('product-account-determination/list/api', ProductAccountDeterminationListAPI.as_view(), name='ProductAccountDeterminationListAPI'),
    path('product-account-determination/detail/api/<str:pk>', ProductAccountDeterminationDetailAPI.as_view(), name='ProductAccountDeterminationDetailAPI'),
]

# dimension
urlpatterns += [
    # view url
    path('dimension-definition/list', DimensionDefinitionList.as_view(), name='DimensionDefinitionList'),
    path('dimension-value/list', DimensionValueList.as_view(), name='DimensionValueList'),

    # api url
    path('dimension-definition/list/api', DimensionDefinitionListAPI.as_view(), name='DimensionDefinitionListAPI'),
    path('dimension-definition/detail/api/<str:pk>', DimensionDefinitionDetailAPI.as_view(), name='DimensionDefinitionDetailAPI'),
    path('dimension-definition-values/api/<str:pk>', DimensionDefinitionWithValueAPI.as_view(), name='DimensionDefinitionWithValueAPI'),
    path('dimension-value/list/api', DimensionValueListAPI.as_view(), name='DimensionValueListAPI'),
    path('dimension-value/detail/api/<str:pk>', DimensionValueDetailAPI.as_view(), name='DimensionValueDetailAPI'),
]
