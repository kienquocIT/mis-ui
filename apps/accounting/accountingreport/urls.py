from django.urls import path

from apps.accounting.accountingreport.views import ReportJournalEntryList, ReportJournalEntryListAPI

urlpatterns = [
    path('journal-entry', ReportJournalEntryList.as_view(), name='ReportJournalEntryList'),
    path('journal-entry/api', ReportJournalEntryListAPI.as_view(), name='ReportJournalEntryListAPI'),
]
