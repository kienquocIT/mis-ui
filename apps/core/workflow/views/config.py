from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.core.workflow.initial_data import Node_data
from apps.shared import mask_view, ServerAPI, ApiURL, WorkflowMsg, ConditionFormset, TypeCheck
from apps.shared.msg import BaseMsg

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


class WorkflowOfAppListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_OF_APPS).get()
        return resp.auto_return(key_success='app_list')


class WorkflowOfAppDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.WORKFLOW_OF_APP_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(user=request.user, url=url).put(data=request.data)
            return resp.auto_return(key_success='app_list')
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class WorkflowList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_list_new.html',
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
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_LIST).get(data=request.query_params.dict())
        return resp.auto_return(key_success='workflow_list')


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
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = WorkflowMsg.WORKFLOW_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class WorkflowDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/workflow/workflow_detail.html',
        menu_active='menu_workflow_list',
        breadcrumb='WORKFLOW_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
                   'wf_actions': WORKFLOW_ACTION,
                   'form': ConditionFormset(),
                   'wf_data_type': WORKFLOW_TYPE
               }, status.HTTP_200_OK

    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW).put(request.data)
        if resp.state:
            resp.result['message'] = WorkflowMsg.WORKFLOW_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class WorkflowDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKFLOW.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = WorkflowMsg.WORKFLOW_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class NodeSystemListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return {'node_system': Node_data}, status.HTTP_200_OK

