from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.shared import ServerAPI, mask_view, ApiURL, ServerMsg
from rest_framework.views import APIView

API_URL = {
    'user_list': 'account/users'
}

TEMPLATE = {
    'list': 'core/home/home.html',
    'detail': '',
}


class HomeView(View):
    @mask_view(
        auth_require=True,
        template='core/home/home.html',
        breadcrumb='HOME_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TenantCompany(View):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True,
               template='core/company/company_list.html',
               breadcrumb='COMPANY_LIST_PAGE')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TenantCompanyCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            print(data)
            response = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).post(data)
            if response.state:
                return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR
