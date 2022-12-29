from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL


class OrganizationCreate(APIView):

    @mask_view(auth_require=True, template='core/organization/organization_create.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        print(request.data)
        return {}, status.HTTP_200_OK


class OrganizationList(APIView):

    @mask_view(auth_require=True, template='core/organization/organization_list.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
