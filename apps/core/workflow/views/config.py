from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, WorkflowMsg, ConditionFormset

WORKFLOW_ACTION = {
    0: WorkflowMsg.ACTION_CREATE,
    1: WorkflowMsg.ACTION_APPROVED,
    2: WorkflowMsg.ACTION_REJECT,
    3: WorkflowMsg.ACTION_RETURN,
    4: WorkflowMsg.ACTION_RECEIVE,
    5: WorkflowMsg.ACTION_TODO,
}

WORKFLOW_TYPE = {

    1: [
        {"value": "is", "text": WorkflowMsg.MATH_TYPE_IS},
        {"value": "is_not", "text": WorkflowMsg.MATH_TYPE_IS_NOT},
        {"value": "contains", "text": WorkflowMsg.MATH_TYPE_CONTAINS},
        {"value": "not_contains", "text": WorkflowMsg.MATH_TYPE_NOT_CONTAINS},
    ],
    2: [
        {"value": "is", "text": WorkflowMsg.MATH_TYPE_IS},
        {"value": "before", "text": WorkflowMsg.MATH_TYPE_BEFORE},
        {"value": "after", "text": WorkflowMsg.MATH_TYPE_AFTER},
        {"value": "on_before", "text": WorkflowMsg.MATH_TYPE_ON_BEFORE},
        {"value": "on_after", "text": WorkflowMsg.MATH_TYPE_ON_AFTER},
        {"value": "range", "text": WorkflowMsg.MATH_TYPE_WITHIN},
        {"value": "is_empty", "text": WorkflowMsg.MATH_TYPE_IS_EMPTY},
        {"value": "is_not_empty", "text": WorkflowMsg.MATH_TYPE_IS_NOT_EMPTY},
    ],
    3: [
        {"value": "is", "text": WorkflowMsg.MATH_TYPE_IS},
        {"value": "is_not", "text": WorkflowMsg.MATH_TYPE_IS_NOT},
        {"value": "contains", "text": WorkflowMsg.MATH_TYPE_CONTAINS},
        {"value": "not_contains", "text": WorkflowMsg.MATH_TYPE_NOT_CONTAINS},
    ],
    4: [
        {"value": "is", "text": WorkflowMsg.MATH_TYPE_IS},
        {"value": "is_not", "text": WorkflowMsg.MATH_TYPE_IS_NOT},
    ],
    5: [
        {"value": "is", "text": WorkflowMsg.MATH_TYPE_IS},
        {"value": "is_not", "text": WorkflowMsg.MATH_TYPE_IS_NOT},
        {"value": "is_empty", "text": WorkflowMsg.MATH_TYPE_IS_EMPTY},
        {"value": "is_not_empty", "text": WorkflowMsg.MATH_TYPE_IS_NOT_EMPTY},
    ],
    6: [
        {"value": "=", "text": "="},
        {"value": "!=", "text": "≠"},
        {"value": ">", "text": ">"},
        {"value": "<", "text": "<"},
        {"value": ">=", "text": "≥"},
        {"value": "<=", "text": "≤"},
        {"value": "is_empty", "text": WorkflowMsg.MATH_TYPE_IS_EMPTY},
        {"value": "is_not_empty", "text": WorkflowMsg.MATH_TYPE_IS_NOT_EMPTY},
    ],

}


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
        return {
                   'wf_actions': WORKFLOW_ACTION,
                   'form': ConditionFormset(),
                   'wf_data_type': WORKFLOW_TYPE
               }, status.HTTP_200_OK


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
