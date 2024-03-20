from rest_framework.views import APIView

from apps.shared import mask_view, ApiURL, ServerAPI


class MailTemplateSystemAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, system_code, **kwargs):
        url = ApiURL.MAILER_SYSTEM_GET.fill_key(system_code=system_code)
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='mailer_system')


class MailTemplateSystemDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        url = ApiURL.MAILER_SYSTEM_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).put(data=request.data)
        return resp.auto_return(key_success='mailer_system')
