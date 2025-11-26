from django.shortcuts import render
from django.views import View
from rest_framework import status

from apps.shared import mask_view


# Create your views here.
class ReportJournalEntryList(View):
    @mask_view(
        auth_require=True,
        template='accounting/journalentry_report/journal_entry_report.html',
        menu_active='menu_report_journal_entry',
        breadcrumb='REPORT_JOURNAL_ENTRY_LIST_PAGE',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-blue',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
