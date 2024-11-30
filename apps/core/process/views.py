from urllib.parse import urlencode

from django.contrib.auth.models import AnonymousUser
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, TypeCheck
from apps.shared.apis import RespData


class ProcessList(View):
    @mask_view(
        login_require=True,
        template='process/config/list.html',
        breadcrumb='PROCESS_LIST_PAGE',
        menu_active='menu_process',
        jsi18n='process',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProcessReadyListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROCESS_CONFIG_READY).get()
        return resp.auto_return(key_success='process_list')


class ProcessListAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROCESS_CONFIG_LIST).get()
        return resp.auto_return(key_success='process_list')

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PROCESS_CONFIG_LIST).post(data=request.data)
        return resp.auto_return(key_success='process_create')


class ProcessCreate(View):
    @mask_view(
        login_require=True,
        template='process/config/create.html',
        breadcrumb='PROCESS_CREATE_PAGE',
        menu_active='menu_process',
        jsi18n='process',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProcessUpdate(View):
    @mask_view(
        login_require=True,
        template='process/config/update.html',
        breadcrumb='PROCESS_UPDATE_PAGE',
        menu_active='menu_process',
        jsi18n='process',
    )
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            return {}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


class ProcessDetail(View):
    @mask_view(
        login_require=True,
        template='process/config/detail.html',
        breadcrumb='PROCESS_DETAIL_PAGE',
        menu_active='menu_process',
        jsi18n='process',
    )
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            return {}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


class ProcessDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_CONFIG_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='process_detail')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_CONFIG_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(data=request.data)
            return resp.auto_return(key_success='process_update')
        return RespData.resp_404()


class ProcessRuntimeListView(View):
    @mask_view(
        login_require=True,
        template='process/runtime/list.html',
        breadcrumb='PROCESS_RUNTIME_LIST_PAGE',
        menu_active='menu_process_runtime',
        jsi18n='process',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProcessRuntimeListMeRedirect(View):
    @mask_view(login_require=True)
    def get(self, request, *args, **kwargs):
        params = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
            if isinstance(employee_current, dict) and 'id' in employee_current and 'full_name' in employee_current:
                params = {
                    'creator': employee_current.get('id', ''),
                    'creator_title': employee_current.get('full_name', ''),
                }
        return redirect(reverse('ProcessRuntimeListView') + '?' + urlencode(params))


class ProcessRuntimeOfMeAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = ApiURL.PROCESS_RUNTIME_LIST_OF_ME
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='process_runtime_list')


class ProcessStagesAppOfMeAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = ApiURL.PROCESS_STAGES_APPS_OF_ME
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='process_runtime_stages_app_list')


class ProcessRuntimeDataMatchAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = ApiURL.PROCESS_DATA_MATCH
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='opp_process_stage_app')


class ProcessRuntimeAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        url = ApiURL.PROCESS_RUNTIME_LIST
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='process_runtime_list')

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        url = ApiURL.PROCESS_RUNTIME_LIST
        resp = ServerAPI(request=request, user=request.user, url=url).post(data=request.data)
        return resp.auto_return(key_success='process_runtime')


class ProcessRuntimeDetailView(View):
    @mask_view(
        login_require=True,
        template='process/runtime/detail.html',
        breadcrumb='PROCESS_RUNTIME_DETAIL_PAGE',
        menu_active='menu_process_runtime',
        jsi18n='process',
    )
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            return {}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


class ProcessRuntimeDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_RUNTIME_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='process_runtime_detail')
        return RespData.resp_404()


class ProcessRuntimeMembersAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_RUNTIME_MEMBERS.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='process_runtime_members')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_RUNTIME_MEMBERS.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).post(request.data)
            return resp.auto_return(key_success='process_runtime_members')
        return RespData.resp_404()


class ProcessRuntimeStageAppDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_RUNTIME_STAGES_APP_COMPLETE.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='stages_app_detail')
        return RespData.resp_404()

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_RUNTIME_STAGES_APP_COMPLETE.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(data=request.data)
            return resp.auto_return(key_success='stages_app_complete')
        return RespData.resp_404()


class ProcessRuntimeMemberDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def delete(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            url = ApiURL.PROCESS_RUNTIME_MEMBER_DETAIL.fill_key(pk=pk)
            resp = ServerAPI(request=request, user=request.user, url=url).delete()
            return resp.auto_return(key_success='stages_app_complete')
        return RespData.resp_404()
