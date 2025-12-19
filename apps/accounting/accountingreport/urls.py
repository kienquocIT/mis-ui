from django.urls import path
from apps.accounting.accountingreport.views import ReportJournalEntryList, ReportJournalEntryListAPI, \
    ReportGeneralLedgerList, ChartOfAccountsSummarizeAPI, ReportTrialBalanceList

urlpatterns = [
    path('journal-entry', ReportJournalEntryList.as_view(), name='ReportJournalEntryList'),
    path('journal-entry/api', ReportJournalEntryListAPI.as_view(), name='ReportJournalEntryListAPI'),
    # report
    path('general-ledger', ReportGeneralLedgerList.as_view(), name='ReportGeneralLedgerList'),
    path('get-je-chart-of-account/api', ChartOfAccountsSummarizeAPI.as_view(), name='GetChartOfAccountSummaryAPI'),
    path('trial-balance', ReportTrialBalanceList.as_view(), name='ReportTrialBalanceList'),
]
