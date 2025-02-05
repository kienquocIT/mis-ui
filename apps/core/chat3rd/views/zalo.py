from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI
from apps.shared.apis import RespData


class ZaloConnected(View):
    @mask_view(
        login_require=True,
        is_api=False,
        template='chat3rd/zalo/connected.html',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        uri = request.GET.get('uri', '')
        code = request.GET.get('code', '')
        if uri and code:
            return ctx, status.HTTP_200_OK
        return ctx, status.HTTP_400_BAD_REQUEST


class ZaloConnectedAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = 'chat3rd/zalo/connect'
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='connected_data')

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        oa_id = request.data.get('oa_id', '')
        code = request.data.get('code', '')
        if oa_id and code:
            url = 'chat3rd/zalo/connect'
            resp = ServerAPI(request=request, user=request.user, url=url).post(
                data={
                    'oa_id': oa_id,
                    'code': code,
                }
            )
            return resp.auto_return(key_success='register_token')
        return RespData.resp_400(errors_data={'message': 'Code and OA ID must be required'})

