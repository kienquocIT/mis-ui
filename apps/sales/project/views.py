__all__ = ['ProjectList']

from django.shortcuts import render
from django.views import View
from rest_framework import status

from apps.shared import mask_view, ServerAPI, ApiURL


class ProjectList(View):
    @mask_view(
        auth_require=True,
        template='sales/project/list.html',
        breadcrumb='PROJECT_LIST',
        menu_active='menu_project',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
