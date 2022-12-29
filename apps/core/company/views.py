from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL


class CompanyList(View):

    @mask_view(auth_require=True, template='core/company/company_list.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
