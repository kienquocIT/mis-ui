from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, ServerMsg


class OrganizationCreate(View):

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
