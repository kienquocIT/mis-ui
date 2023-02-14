from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.shared import mask_view, ServerAPI, ApiURL


class WorkflowList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_list.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

class WorkflowListAPI(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_list.html',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_LIST).get()
        if resp.state:
            return resp.result, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class WorkflowCreate(View):
    permission_classes = [IsAuthenticated]
    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_list.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK