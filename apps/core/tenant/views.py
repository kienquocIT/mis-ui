from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.shared import mask_view, ServerAPI, ApiURL


# Create your views here.

class TenantInformation(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/tenant/tenant_information.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TenantInformationAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TENANT).get()
        return resp.auto_return(key_success='tenant')


class TenantPlanListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.TENANT_PLAN_LIST, user=request.user).get()
        return resp.auto_return(key_success='tenant_plan_list')
