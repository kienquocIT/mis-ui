from django.views import View
from rest_framework import status

from apps.shared import mask_view, ConditionFormset

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
        breadcrumb='HOME_PAGE',
        menu_active='id_menu_home_page',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ComponentCollections(View):
    @mask_view(
        auth_require=True,
        template='components.html',
        breadcrumb='COMPONENTS_PAGE'
    )
    def get(self, request, *args, **kwargs):
        cond_formset = ConditionFormset()
        return {"form": cond_formset}, status.HTTP_200_OK


class TermsAndConditionsView(View):
    @mask_view(
        auth_require=True,
        template='core/terms/terms.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class HelpAndSupportView(View):
    @mask_view(
        auth_require=True,
        template='core/help_support/help_support.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

