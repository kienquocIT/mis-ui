import json
from rest_framework.views import APIView

from rest_framework.response import Response
from apps.shared import ServerAPI, ApiURL, mask_view, ServerMsg


TEMPLATE = {
    'list': 'core/account/user_list.html',
    'detail': '',
}


class UserListView(APIView):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        user_list = ServerAPI(user=None, url=ApiURL.user_list).get()
        if user_list.state:
            return {'user_list': user_list.result}
        return Response({'detail': user_list.errors}, status=400)

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            user = ServerAPI(user=None, url=ApiURL.user_list).post(data)
            if user.state:
                return Response({
                    "code": 200,
                    "status": "successful",
                    "message": "code was sent try to validate code"
                })
        return Response({'detail': ServerMsg.server_err}, status=500)


class UserDetailView(APIView):

    @mask_view(auth_require=True, template='core/account/user_detail.html')
    def get(self, request, pk, *args, **kwargs):
        user = ServerAPI(user=None, url=ApiURL.user_list + '/' + pk).get()
        if user.state:
            return {'user': user.result}
        return Response({'detail': user.errors}, status=400)

