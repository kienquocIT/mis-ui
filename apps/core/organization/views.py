from django.views import View
from rest_framework import status

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
        return {}


# Group
class OrganizationCreate(APIView):

    @mask_view(auth_require=True, template='core/organization/grouplevel/create.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OrganizationCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        # org = ServerAPI(user=request.user, url=ApiURL.user_list).post(data)
        # if org.state:
        #     return org.result, status.HTTP_200_OK

        # return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR

        return {}, status.HTTP_200_OK


class GroupList(View):
    @mask_view(
        auth_require=True,
        template='core/organization/group/group_list.html',
        breadcrumb='GROUP_LIST_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}


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
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class RoleList(View):

    @mask_view(auth_require=True, template='core/organization/role/list_role.html', breadcrumb='ROLE_LIST_PAGE')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleCreate(View):
    @mask_view(auth_require=True, template='core/organization/role/create_role.html', breadcrumb="ROLE_CREATE_PAGE")
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleDetail(View):
    @mask_view(auth_require=True, template='core/organization/role/update_role.html')
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        role_list = ServerAPI(user=request.user, url=ApiURL.ROLE_LIST).get()
        if role_list.state:
            return {'role_list': role_list.result}, status.HTTP_200_OK
        return {'detail': role_list.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_LIST).post(data)
        if role.state:
            return role.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class RoleDetailAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, pk, *args, **kwargs):
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_DETAIL + '/' + pk).get()
        if role.state:
            return {'role': role.result}, status.HTTP_200_OK
        return {'detail': role.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_DETAIL + '/' + pk).put(data)
        if role.state:
            return role.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_DETAIL + '/' + pk).delete(request.data)
        if role.state:
            return role.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR
