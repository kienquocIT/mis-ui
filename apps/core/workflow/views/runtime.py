from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, TypeCheck, ApiURL, ServerAPI
from apps.shared.msg import BaseMsg


class FlowRuntimeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, flow_id, **kwargs):
        if TypeCheck.check_uuid(flow_id):
            data = {'flow_id': flow_id}
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.RUNTIME_LIST).get(data=data)
            return resp.auto_return(key_success='runtime_list')
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeMeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.RUNTIME_LIST_ME).get(
            data=request.query_params.dict()
        )
        return resp.auto_return(key_success='runtime_list')


class FlowRuntimeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.RUNTIME_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='runtime_detail')
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeDiagramDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.RUNTIME_DIAGRAM_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='diagram_data')
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeTaskListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.RUNTIME_TASK_LIST).get(
            data=request.query_params.dict()
        )
        return resp.auto_return(key_success='task_list')


class FlowRuntimeTaskDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.RUNTIME_TASK_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(data=request.data)
            return resp.auto_return(key_success='result')
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST
