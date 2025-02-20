from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    DefaultAccountDefinitionList, DefaultAccountDefinitionListAPI
)

urlpatterns = [
    path('chart-of-accounts/list', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/list/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
    path('default-account-definition/list', DefaultAccountDefinitionList.as_view(), name='DefaultAccountDefinitionList'),
    path('default-account-definition/list/api', DefaultAccountDefinitionListAPI.as_view(), name='DefaultAccountDefinitionListAPI'),
]
