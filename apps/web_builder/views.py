from django.views import View
from rest_framework import status

from apps.shared import mask_view


class MyCompanyWebsiteList(View):
    @mask_view(
        auth_require=True,
        template='builder/pages.html',
        breadcrumb='MY_WEBSITE_LIST',
        # menu_active='menu_user_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class MyCompanyWebsiteDetail(View):
    @mask_view(
        auth_require=True,
        template='builder/editor.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
