from django.views import View
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.shared import ServerAPI, ApiURL, mask_view, ServerMsg


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
            if rest.state and rest.status:
                if rest.state is True and rest.status == 200 and rest.result:
                    return rest.result
        return {}


class TenantCompany(View):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, template='core/company/company_list.html')
    def get(self, request, *args, **kwargs):
        return {}
