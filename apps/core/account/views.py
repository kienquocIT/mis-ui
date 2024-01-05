from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from rest_framework.response import Response
from apps.shared import ServerAPI, ApiURL, mask_view, ServerMsg, TypeCheck

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
    @mask_view(
        auth_require=True,
        template='core/account/user_detail.html',
        breadcrumb='USER_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UserEdit(View):
    @mask_view(
        auth_require=True,
        template='core/account/user_edit.html',
        breadcrumb='USER_EDIT_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class UserResetPassword(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.USER_RESET_PASSWORD.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
            return resp.auto_return()
        return {}, status.HTTP_404_NOT_FOUND


class UserListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.user_list).get()
        return resp.auto_return(key_success='user_list')

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.user_list).post(request.data)
        return resp.auto_return()


class UserDetailAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.user_detail + '/' + pk).get()
        return resp.auto_return(key_success='user')

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.user_detail + '/' + pk).put(request.data)
        return resp.auto_return()

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.user_detail + '/' + pk).delete(request.data)
        return resp.auto_return()


class UserTenantOverviewListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ACCOUNT_USER_TENANT).get()
        return resp.auto_return(key_success='user_list')
