from django.views import View
from rest_framework import status
from apps.shared import mask_view

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

