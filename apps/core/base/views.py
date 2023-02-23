from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, ServerMsg


# Subscription Plan
class PlanListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.PLAN_LIST, user=request.user).get()
        if resp.state:
            return {'plan_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


# Tenant application list
class TenantApplicationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.TENANT_APPLICATION_LIST, user=request.user).get()
        if resp.state:
            return {'tenant_application_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


# Tenant application list
class ApplicationPropertyListAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(url=ApiURL.APPLICATION_PROPERTY_LIST, user=request.user).get(data)
        if resp.state:
            return {'application_property_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
