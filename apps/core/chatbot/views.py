from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class ChatbotView(View):
    @mask_view(
        login_require=True,
        template='bflow-ai/chat_view.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ChatbotAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.CHATBOT_CHAT).post(data=request.data)
        return resp.auto_return(key_success='answer')
