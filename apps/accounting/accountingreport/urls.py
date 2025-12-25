from django.urls import path
from apps.accounting.accountingreport.views import ReportJournalEntryList, ReportJournalEntryListAPI, \
    ReportGeneralLedgerList, ReportTrialBalanceList, ChartOfAccountTypeTreeListAPI, ChartOfAccountGroupListAPI, \
    ChartOfAccountsSummarizeAPI, ReportAccountBalanceList

urlpatterns = [
    # journal entry report
    path('journal-entry', ReportJournalEntryList.as_view(), name='ReportJournalEntryList'),
    path('journal-entry/api', ReportJournalEntryListAPI.as_view(), name='ReportJournalEntryListAPI'),

    #  general ledger report
    path('general-ledger', ReportGeneralLedgerList.as_view(), name='ReportGeneralLedgerList'),
    path('get-je-chart-of-account/api', ChartOfAccountsSummarizeAPI.as_view(), name='GetChartOfAccountSummaryAPI'),

    # account balance report
    path('account-balance', ReportAccountBalanceList.as_view(), name='ReportAccountBalanceList'),
    path('chart-of-account-type-tree/api', ChartOfAccountTypeTreeListAPI.as_view(),
         name='ChartOfAccountTypeTreeListAPI'),
    path('chart-of-account-group-list/api', ChartOfAccountGroupListAPI.as_view(), name='ChartOfAccountGroupListAPI'),

    # trial balance report
    path('trial-balance', ReportTrialBalanceList.as_view(), name='ReportTrialBalanceList'),
]
