__all__ = ['ProjectList', 'ProjectListAPI', 'ProjectCreate', 'ProjectCreateAPI', 'ProjectDetail', 'ProjectDetailAPI',
           'ProjectEdit', 'ProjectEditAPI', 'ProjectCreateGroupAPI', 'ProjectGroupListAPI', 'ProjectWorkCreateAPI',
           'ProjectWorkListAPI']

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, SYSTEM_STATUS, InputMappingProperties
from apps.shared.constant import DEPENDENCIES_TYPE
from apps.shared.msg import BaseMsg


class ProjectList(View):
    @mask_view(
        auth_require=True,
        template='sales/project/list.html',
        breadcrumb='PROJECT_LIST',
        menu_active='menu_project',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='project_list')


class ProjectCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/project/create.html',
        breadcrumb='PROJECT_CREATE_PAGE',
        menu_active='menu_project',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'dependencies_list': DEPENDENCIES_TYPE,
                   'list_from_app': 'project.project.view'
               }, status.HTTP_200_OK


class ProjectCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/project/detail.html',
        breadcrumb='PROJECT_DETAIL_PAGE',
        menu_active='menu_project',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'dependencies_list': DEPENDENCIES_TYPE,
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
               }, status.HTTP_200_OK


class ProjectDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()


class ProjectEdit(View):
    @mask_view(
        auth_require=True,
        template='sales/project/edit.html',
        breadcrumb='PROJECT_UPDATE_PAGE',
        menu_active='menu_project',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
                   'dependencies_list': DEPENDENCIES_TYPE,
                   'list_from_app': 'project.project.edit'
               }, status.HTTP_200_OK


class ProjectEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ASSET_TOOLS_RETURN_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT} {BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectCreateGroupAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_LIST.fill_key(pk_pj=data.get('project'))).post(
            data
        )
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_GROUP} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectGroupListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_LIST).get()
        return resp.auto_return(key_success='pj_group_list')


class ProjectWorkCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_LIST).post(data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_WORK} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectWorkListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_LIST).get()
        return resp.auto_return(key_success='pj_work_list')
