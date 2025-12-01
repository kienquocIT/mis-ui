from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

# JE document type
class JEDocumentTypeList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/je_document_type.html',
        breadcrumb='JE_DOCUMENT_TYPE_LIST_PAGE',
        menu_active='menu_je_document_type',
        icon_cls='fa-solid fa-infinity',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class JEDocumentTypeListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_DOCUMENT_TYPE_LIST).get(params)
        return resp.auto_return(key_success='je_document_type')


class JEDocumentTypeDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.JE_DOCUMENT_TYPE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


# JE posting Rule
class JEPostingRuleList(View):
    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/je_posting_rule.html',
        breadcrumb='JE_POSTING_RULE_LIST_PAGE',
        menu_active='menu_je_posting_rule',
        icon_cls='fa-solid fa-pen-ruler',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class JEPostingRuleListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.JE_POSTING_RULE_LIST).get(params)
        return resp.auto_return(key_success='je_posting_rule')
