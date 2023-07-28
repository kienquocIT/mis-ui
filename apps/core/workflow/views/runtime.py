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
            resp = ServerAPI(user=request.user, url=ApiURL.RUNTIME_LIST).get(data={'flow_id': flow_id})
            if resp.state:
                return {'runtime_list': resp.result}, status.HTTP_200_OK
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeMeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RUNTIME_LIST_ME).get(data=request.query_params.dict())
        if resp.state:
            return {'runtime_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            resp = ServerAPI(user=request.user, url=ApiURL.RUNTIME_DETAIL.fill_key(pk=pk)).get()
            if resp.state:
                return {'runtime_detail': resp.result}, status.HTTP_200_OK
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeDiagramDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            resp = ServerAPI(user=request.user, url=ApiURL.RUNTIME_DIAGRAM_DETAIL.fill_key(pk=pk)).get()
            if resp.state:
                return {'diagram_data': resp.result}, status.HTTP_200_OK
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeTaskListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RUNTIME_TASK_LIST).get(data=request.query_params.dict())
        if resp.state:
            return {'task_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class FlowRuntimeTaskDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            resp = ServerAPI(user=request.user, url=ApiURL.RUNTIME_TASK_DETAIL.fill_key(pk=pk)).put(
                data=request.data
            )
            if resp.state:
                return {'result': resp.result}, status.HTTP_200_OK
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {'errors': BaseMsg.NOT_FOUND}, status.HTTP_400_BAD_REQUEST
