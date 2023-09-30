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
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        return resp.auto_return(key_success='task_config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_TASK_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class OpportunityTaskStatusAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_STT_LIST).get()
        return resp.auto_return(key_success='task_status')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        data_params = request.data
        pk = data_params.get('id', '')
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_STT_UPDATE.push_id(pk)).put(data_params)
        return resp.auto_return()


class OpportunityTaskList(View):

    @mask_view(
        auth_require=True,
        template='sales/task/list.html',
        breadcrumb='OPPORTUNITY_TASK_LIST_PAGE',
        menu_active='menu_opportunity_task',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if resp.state:
            task_config = resp.result
        return {'task_config': task_config}, status.HTTP_200_OK


class OpportunityTaskListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_LIST).get()
        return resp.auto_return(key_success='task_list')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_TASK_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_TASK_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class OpportunityTaskDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_DETAIL.push_id(pk)).put(request.data)
        return resp.auto_return()

    @mask_view(login_require=True,auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        url = ApiURL.OPPORTUNITY_TASK_DETAIL.push_id(pk)
        resp = ServerAPI(user=request.user, url=url).delete({})
        if resp.state:
            return {'message': SaleMsg.OPPORTUNITY_TASK_DELETE}, status.HTTP_200_OK
        return resp.auto_return()


class OpportunityTaskLogTimeAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_LOG_WORK).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.OPPORTUNITY_TASK_LOG
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
