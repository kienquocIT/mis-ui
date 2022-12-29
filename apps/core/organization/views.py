from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL

from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework import status

# Group
class GroupList(View):
    @mask_view(auth_require=True, template='core/organization/group/group_list.html', breadcrumb='GROUP_LIST_PAGE')
    def get(self, request, *args, **kwargs):
        return {}


# Group Level
class GroupLevelList(View):
    @mask_view(
        auth_require=True,
        template='core/organization/grouplevel/level_list.html',
        breadcrumb='GROUP_LEVEL_LIST_PAGE',
        menu_active='menu-employee-list',
    )
    def get(self, request, *args, **kwargs):
        return {}


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


class RoleList(View):

    @mask_view(auth_require=True, template='core/organization/role/list_role.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
