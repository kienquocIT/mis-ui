from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class JournalEntryList(View):
    @mask_view(
        auth_require=True,
        template='journalentry/journalentry_list.html',
        breadcrumb='JOURNAL_ENTRY_LIST_PAGE',
        menu_active='menu_journal_entry_list',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class JournalEntryCreate(View):
    @mask_view(
        auth_require=True,
        template='journalentry/journalentry_create.html',
        breadcrumb='JOURNAL_ENTRY_CREATE_PAGE',
        menu_active='',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class JournalEntryDetail(View):
    @mask_view(
        auth_require=True,
        template='journalentry/journalentry_detail.html',
        breadcrumb='JOURNAL_ENTRY_DETAIL_PAGE',
        menu_active='',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class JournalEntryListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JOURNAL_ENTRY_LIST).get(params)
        return resp.auto_return(key_success='journal_entry_list')


class JournalEntryDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JOURNAL_ENTRY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='journal_entry_detail')


class JournalEntrySummarizeAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JOURNAL_ENTRY_SUMMARIZE).get()
        return resp.auto_return(key_success='journal_entry_summarize')
