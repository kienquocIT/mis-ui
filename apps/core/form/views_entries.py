from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ApiURL, ServerAPI, TypeCheck
from apps.shared.apis import RespData


class FormEntriesListView(View):
    @mask_view(
        auth_require=True,
        template='form_entries/list.html',
        jsi18n='form',
        breadcrumb='FORM_ENTRIES_LIST',
        menu_active='menu_form_data',
        # enable_page_content_css=False,
    )
    def get(self, request, *args, pk, **kwargs):
        return {}, status.HTTP_200_OK


class FormEntriesListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_ENTRIES_LIST.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get(request.data)
            return resp.auto_return(key_success='form_entries_list')
        return RespData.resp_404()


class FormEntriesRefNameListAPI(APIView):
    @classmethod
    def return_success(cls, result):
        return result

    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.FORM_ENTRIES_REF_NAME_LIST.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get(request.data)
            return resp.auto_return(callback_success=self.return_success)
        return RespData.resp_404()
