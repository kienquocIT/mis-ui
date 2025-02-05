from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, TypeCheck, LEAD_STATUS
from apps.shared.apis import RespData


class ChatMessengerLimitAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = 'chat3rd/messenger/limit'
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='messenger_limit')


class MessengerConnected(View):
    @mask_view(
        login_require=True,
        is_api=False,
        template='chat3rd/messenger/connected.html',
    )
    def get(self, request, *args, **kwargs):
        uri = request.GET.get('uri', '')
        code = request.GET.get('code', '')
        if uri and code:
            return {}, status.HTTP_200_OK
        return {}, status.HTTP_400_BAD_REQUEST


class MessengerConnectedAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = 'chat3rd/messenger/connect'
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='connected_data')

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        uri = request.data.get('redirect_url', '')
        code = request.data.get('code', '')
        if uri and code:
            url = 'chat3rd/messenger/connect'
            resp = ServerAPI(request=request, user=request.user, url=url).post(
                data={
                    'redirect_uri': uri,
                    'code': code,
                }
            )
            return resp.auto_return(key_success='register_token')
        return RespData.resp_400(errors_data={'message': 'Uri and code must be required'})


class MessengerAccountSyncAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = f'chat3rd/messenger/parent/{pk}/accounts-sync'
            resp = ServerAPI(request=request, user=request.user, url=url).post(data={})
            return resp.auto_return(key_success='sync')
        return RespData.resp_404()


class MessengerPersonAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, page_id, **kwargs):
        if page_id and TypeCheck.check_uuid(page_id):
            url = f'chat3rd/messenger/persons/page/{page_id}'
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='persons')
        return RespData.resp_404()


class MessengerPersonChatAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, page_id, person_id, **kwargs):
        if page_id and TypeCheck.check_uuid(page_id) and person_id and TypeCheck.check_uuid(person_id):
            url = f'chat3rd/messenger/chat/{page_id}/{person_id}'
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='messages')
        return RespData.resp_404()


class MessengerConfigView(View):
    @mask_view(
        login_require=True,
        is_api=False,
        template='chat3rd/messenger_config.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class MessengerPersonDetailContactAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = f'chat3rd/messenger/person/{pk}/contact'
            resp = ServerAPI(request=request, user=request.user, url=url).put(data=request.data)
            return resp.auto_return(key_success='person_detail')
        return RespData.resp_404()


class MessengerPersonDetailLeadAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = f'chat3rd/messenger/person/{pk}/lead'
            resp = ServerAPI(request=request, user=request.user, url=url).put(data=request.data)
            return resp.auto_return(key_success='person_detail')
        return RespData.resp_404()
