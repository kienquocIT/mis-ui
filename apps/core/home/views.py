from django.views import View
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.shared import ServerAPI, ApiURL, mask_view


class HomeView(View):
    @mask_view(auth_require=True, template='core/home/home.html')
    def get(self, request, *args, **kwargs):
        user_list = []
        return {'user_list': user_list}


class TenantCompany(View):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, template='core/company/company_list.html')
    def get(self, request, *args, **kwargs):
        return {}
