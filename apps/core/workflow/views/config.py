import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, WorkflowMsg


class WorkflowList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_list.html',
        menu_active='menu_workflow_list',
        breadcrumb='WORKFLOW_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WorkflowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_LIST).get()
        if resp.state:
            return {'workflow_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST


class WorkflowCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_create.html',
        breadcrumb='WORKFLOW_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WorkflowCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_LIST).post(data)
        if resp.state:
            resp.result['message'] = WorkflowMsg.WORKFLOW_CREATE
            return resp.result, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class WorkflowDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_create.html',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class NodeSystemListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_NODE_SYSTEM_LIST).get()
        if resp.state:
            return {'node_system': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
