from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL

from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL


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

    @mask_view(auth_require=True, template='core/organization/organization_create.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        print(request.data)
        return {}, status.HTTP_200_OK

