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


class TenantCompanyListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        # return {'company_list': [
        #     {'company_name': 'Cong ty 1', 'cre_date': '20/11/2022', "representative": 'Nguyen Van A'},
        #     {'company_name': 'Cong ty 2', 'cre_date': '21/11/2022', "representative": 'Tran Thi C'},
        #     {'company_name': 'Cong ty 3', 'cre_date': '22/11/2022', "representative": 'Nguyen Van Y'},
        #     {'company_name': 'Cong ty 4', 'cre_date': '23/11/2022', "representative": 'Pham Van B'},
        #     {'company_name': 'Cong ty 5', 'cre_date': '24/11/2022', "representative": 'Nguyen Van R'},
        #     {'company_name': 'Cong ty 6', 'cre_date': '25/11/2022', "representative": 'Le Van W'},
        # ]}, status.HTTP_200_OK
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).get()
        if resp.state:
            return {'company_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            response = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).post(data)
            if response.state:
                return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR
