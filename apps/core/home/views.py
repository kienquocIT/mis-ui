from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.shared import ServerAPI, mask_view

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
