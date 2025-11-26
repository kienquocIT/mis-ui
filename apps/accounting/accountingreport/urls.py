from django.urls import path

from apps.accounting.accountingreport.views import ReportJournalEntryList

urlpatterns = [
    path('journal-entry', ReportJournalEntryList.as_view(), name='ReportJournalEntryList'),
]
