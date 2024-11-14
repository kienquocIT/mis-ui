from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    DefaultAccountDefinitionList, DefaultAccountDefinitionListAPI
)

urlpatterns = [
    path('chart-of-accounts', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
    path('default-account-definition', DefaultAccountDefinitionList.as_view(), name='DefaultAccountDefinitionList'),
    path('default-account-definition/api', DefaultAccountDefinitionListAPI.as_view(), name='DefaultAccountDefinitionListAPI'),
]
