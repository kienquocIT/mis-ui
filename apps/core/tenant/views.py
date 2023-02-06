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
        tenant = ServerAPI(user=request.user, url=ApiURL.TENANT).get()
        if tenant.state:
            return {'tenant': tenant.result}, status.HTTP_200_OK
        return {'detail': tenant.errors}, status.HTTP_401_UNAUTHORIZED


class TenantPlanListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.TENANT_PLAN_LIST, user=request.user).get()
        if resp.state:
            return {'tenant_plan_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
