from django.urls import path
from apps.accounting.journalentry.views import (
    JournalEntryList, JournalEntryListAPI
)

urlpatterns = [
    path('journal-entry/', JournalEntryList.as_view(), name='JournalEntryList'),
    path('journal-entry/api', JournalEntryListAPI.as_view(), name='JournalEntryListAPI'),
]
