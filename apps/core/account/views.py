from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from rest_framework.response import Response
from apps.shared import ServerAPI, ApiURL, mask_view, ServerMsg

TEMPLATE = {
    'list': 'core/account/user_list.html',
    'detail': '',
}


class UserList(View):
    @mask_view(
        auth_require=True,
        template='core/account/user_list.html',
        breadcrumb='USER_LIST_PAGE',
        menu_active='menu_user_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UserCreate(View):
    @mask_view(
        auth_require=True,
        template='core/account/user_create.html',
        breadcrumb='USER_CREATE_PAGE',
        menu_active='menu_user_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UserDetail(View):
    @mask_view(auth_require=True, template='core/account/user_detail.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UserEdit(View):
    @mask_view(auth_require=True, template='core/account/user_edit.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UserListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        user_list = ServerAPI(user=request.user, url=ApiURL.user_list).get()
        if user_list.state:
            return {'user_list': user_list.result}, status.HTTP_200_OK
        return {'errors': user_list.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.user_list).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        else:
            if response.errors:
                if isinstance(response.errors, dict):
                    err_msg = ""
                    for key, value in response.errors.items():
                        err_msg += str(key) + ": " + str(value)
                        break
                    return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST


class UserDetailAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, pk, *args, **kwargs):
        user = ServerAPI(user=request.user, url=ApiURL.user_detail + '/' + pk).get()
        if user.state:
            return {'user': user.result}, status.HTTP_200_OK
        return {'errors': user.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.user_detail + '/' + pk).put(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        else:
            if response.errors:
                if isinstance(response.errors, dict):
                    err_msg = ""
                    for key, value in response.errors.items():
                        err_msg += str(key) + ": " + str(value)
                        break
                    return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        user = ServerAPI(user=request.user, url=ApiURL.user_detail + '/' + pk).delete(request.data)
        if user.state:
            return {}, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR
