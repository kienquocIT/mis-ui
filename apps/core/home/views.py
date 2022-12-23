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
            if rest.result:
                return render(request, TEMPLATE.get('list'), {'ctx': rest.result})
        return Response({'detail': ServerMsg.server_err}, status=500)


class TenantCompany(View):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, template='core/company/company_list.html')
    def get(self, request, *args, **kwargs):
        return {}
