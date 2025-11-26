from django.urls import path
from apps.accounting.journalentry.views import (
    JournalEntryList, JournalEntryCreate, JournalEntryDetail, JournalEntryListAPI, JournalEntryDetailAPI,
    JournalEntrySummarizeAPI, AllowedAppAutoJEList, AllowedAppAutoJEListAPI, AllowedAppAutoJEDetailAPI
)

urlpatterns = [
    path('allow-app-auto-je/list', AllowedAppAutoJEList.as_view(), name='AllowedAppAutoJEList'),
    path('allow-app-auto-je/list/api', AllowedAppAutoJEListAPI.as_view(), name='AllowedAppAutoJEListAPI'),
    path('allow-app-auto-je/detail/api/<str:pk>', AllowedAppAutoJEDetailAPI.as_view(), name='AllowedAppAutoJEDetailAPI'),
    path('list', JournalEntryList.as_view(), name='JournalEntryList'),
    path('create', JournalEntryCreate.as_view(), name='JournalEntryCreate'),
    path('detail/<str:pk>', JournalEntryDetail.as_view(), name='JournalEntryDetail'),
    path('list/api', JournalEntryListAPI.as_view(), name='JournalEntryListAPI'),
    path('detail/api/<str:pk>', JournalEntryDetailAPI.as_view(), name='JournalEntryDetailAPI'),
    path('get-je-summarize/api', JournalEntrySummarizeAPI.as_view(), name='JournalEntrySummarizeAPI'),
]
