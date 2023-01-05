


import os

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, ServerMsg


# Group Level
class GroupLevelList(View):
    @mask_view(
        auth_require=True,
        template='core/organization/grouplevel/level_list.html',
        breadcrumb='GROUP_LEVEL_LIST_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupLevelListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.GROUP_LEVEL_LIST, user=request.user).get()
        if resp.state:
            return {'group_level_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            response = ServerAPI(user=request.user, url=ApiURL.GROUP_LEVEL_LIST).post(data)
            if response.state:
                return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class GroupLevelCreate(View):
    @mask_view(
        auth_require=True,
        template='core/organization/grouplevel/level_create.html',
        breadcrumb='GROUP_LEVEL_CREATE_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


# Group
class GroupCreate(APIView):

    @mask_view(auth_require=True, template='core/organization/group/create.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupList(View):
    @mask_view(
        auth_require=True,
        template='core/organization/group/group_list.html',
        breadcrumb='GROUP_LIST_PAGE',
        menu_active='menu-group-list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.GROUP_LIST, user=request.user).get()
        if resp.state:
            return {'group_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            response = ServerAPI(user=request.user, url=ApiURL.GROUP_LIST).post(data)
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
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class GroupDetailAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.GROUP_DETAIL + '/' + pk).delete(request.data)
        if response.state:
            return{}, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR
