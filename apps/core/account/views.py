from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.views import APIView, View
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from apps.shared import ServerAPI, ApiURL, mask_view, ServerMsg

TEMPLATE = {
    'list': 'core/account/user_list.html',
    'detail': '',
}


class UserList(View):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        return {}


class UserListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        user_list = ServerAPI(url=ApiURL.user_list).get()
        if user_list.state:
            return {'user_list': user_list.result}
        # elif user_list.status == 401:
        #     request.session.flush()
        #     return redirect(reverse('AuthLogin'))
        return False, {'detail': user_list.errors}

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            user = ServerAPI(url=ApiURL.user_list).post(data)
            if user.state:
                return Response({
                    "code": 200,
                    "status": "successful",
                    "message": "code was sent try to validate code"
                })
        return {'detail': ServerMsg.server_err}


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, template='core/account/user_detail.html')
    def get(self, request, pk, *args, **kwargs):
        user = ServerAPI(url=ApiURL.user_list + '/' + pk).get()
        if user.state:
            return {'user': user.result}
        return Response({'detail': user.errors}, status=400)

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        print(request.data)
        return {}
