from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.shared import mask_view, ApiURL, ServerAPI


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


class ReportJournalEntryListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JOURNAL_ENTRY_LINE_LIST).get(params)
        return resp.auto_return(key_success='report_journal_entry_list')


class ReportGeneralLedgerList(View):
    @mask_view(
        auth_require=True,
        template='accounting/generalledger_report/general_ledger_report.html',
        menu_active='menu_report_general_ledger',
        breadcrumb='REPORT_GENERAL_LEDGER_LIST_PAGE',
        icon_cls='fas fa-book-open',
        icon_bg='bg-blue',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ChartOfAccountsSummarizeAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CHART_OF_ACCOUNTS_SUMMARIZE).get(params)
        return resp.auto_return(key_success='journal_entry_summarize')