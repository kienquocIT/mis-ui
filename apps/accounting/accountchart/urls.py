from django.urls import path
from apps.accounting.accountchart.views import AccountChartList, AccountChartListAPI

urlpatterns = [
    path('account-chart-list', AccountChartList.as_view(), name='AccountChartList'),
    path('account-chart-list/api', AccountChartListAPI.as_view(), name='AccountChartListAPI'),
]