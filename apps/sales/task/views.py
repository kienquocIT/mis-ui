from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg

__all__ = ['OpportunityTaskConfig', 'OpportunityTaskConfigAPI', 'OpportunityTaskList', 'OpportunityTaskListAPI',
           'OpportunityTaskStatusAPI', 'OpportunityTaskDetailAPI', 'OpportunityTaskLogTimeAPI']


class OpportunityTaskConfig(View):
    @mask_view(
        auth_require=True,
        template='sales/task/config.html',
        breadcrumb='OPPORTUNITY_TASK_CONFIG_PAGE',
        menu_active='menu_opportunity_task_config',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityTaskConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        if res.state:
            return {'task_config': res.result}, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).put(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_TASK_CONFIG_UPDATE
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST


class OpportunityTaskStatusAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_STT_LIST).get()
        if res.state:
            return {'task_status': res.result}, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        data_params = request.data
        pk = data_params.get('id', '')
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_STT_UPDATE.push_id(pk)).put(data_params)
        if res.state:
            return {}, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST


class OpportunityTaskList(View):

    @mask_view(
        auth_require=True,
        template='sales/task/list.html',
        breadcrumb='OPPORTUNITY_TASK_LIST_PAGE',
        menu_active='menu_opportunity_task',
    )
    def get(self, request, *args, **kwargs):
        config = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if config.state:
            task_config = config.result
        return {'task_config': task_config}, status.HTTP_200_OK


class OpportunityTaskListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_LIST).get()
        if res.state:
            return {'task_list': res.result}, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_LIST).post(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_TASK_CREATE
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).put(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_TASK_CONFIG_UPDATE
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST


class OpportunityTaskDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, pk, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_DETAIL.push_id(pk)).get()
        if res.state:
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        req = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_DETAIL.push_id(pk)).put(request.data)
        if req.state:
            req.result['message'] = SaleMsg.OPPORTUNITY_TASK_UPDATE
            return req.result, status.HTTP_200_OK
        elif req.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': req.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(login_require=True,auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user, url=ApiURL.OPPORTUNITY_TASK_DETAIL.push_id(pk)
        ).delete({})
        if resp.state:
            return {'message': SaleMsg.OPPORTUNITY_TASK_DELETE}, status.HTTP_200_OK
        return {'detail': resp.errors}, status.HTTP_500_INTERNAL_SERVER_ERROR


class OpportunityTaskLogTimeAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_LOG_WORK).post(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_TASK_LOG
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST
