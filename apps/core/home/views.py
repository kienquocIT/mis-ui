from django.shortcuts import render
from django.views import View
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
    @mask_view(auth_require=True, template='core/home/home.html')
    def get(self, request, *args, **kwargs):
        rest = ServerAPI(user=request.user, url=API_URL.get('user_list')).get()
        if rest:
            if rest.result:
                return rest.result
        return False, None,


class TenantCompany(View):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, template='core/company/company_list.html')
    def get(self, request, *args, **kwargs):
        return {}
