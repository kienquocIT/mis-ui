from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg.process import ProcessMsg


class SaleProcess(View):
    @mask_view(
        auth_require=True,
        template='core/process/sale_process.html',
        menu_active='menu_sale_process',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FunctionProcessListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FUNCTION_PROCESS_LIST).get()
        return resp.auto_return(key_success='function_list')


class SaleProcessAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROCESS).get()
        return resp.auto_return(key_success='process')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROCESS).put(request.data)
        if resp.state:
            resp.result['message'] = ProcessMsg.PROCESS_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class SkipProcessStepAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SKIP_PROCESS_STEP.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = ProcessMsg.PROCESS_STEP_SKIP
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class SetCurrentProcessStepAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SET_CURRENT_PROCESS_STEP.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = ProcessMsg.PROCESS_STEP_SET_CURRENT
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
