from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg

__all__ = ['OpportunityTaskConfig', 'OpportunityTaskConfigAPI', 'OpportunityTaskList', 'OpportunityTaskListAPI']


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


class OpportunityTaskList(View):
    @mask_view(
        auth_require=True,
        template='sales/task/list.html',
        breadcrumb='OPPORTUNITY_TASK_LIST_PAGE',
        menu_active='menu_opportunity_task',
    )
    def get(self, request, *args, **kwargs):
        no_wrap_scroll = True
        config = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).get()
        task_config = {}
        if config.state:
            task_config = config.result
        return {'without_simplebar': no_wrap_scroll, 'task_config': task_config}, status.HTTP_200_OK


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
    def put(self, request, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.OPPORTUNITY_TASK_CONFIG).put(request.data)
        if res.state:
            res.result['message'] = SaleMsg.OPPORTUNITY_TASK_CONFIG_UPDATE
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST
