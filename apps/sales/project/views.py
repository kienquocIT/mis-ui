__all__ = ['ProjectList', 'ProjectListAPI', 'ProjectCreate', 'ProjectCreateAPI', 'ProjectDetail', 'ProjectDetailAPI',
           'ProjectEdit', 'ProjectEditAPI', 'ProjectCreateGroupAPI', 'ProjectGroupListAPI', 'ProjectWorkCreateAPI',
           'ProjectWorkListAPI', 'ProjectGroupDetailAPI', 'ProjectWorkDetailAPI', 'ProjectMemberAddAPI',
           'ProjectMemberDetailAPI', 'ProjectUpdateOrderAPI', 'ProjectTaskListAPI', 'ProjectGroupDDListAPI',
           'ProjectTaskDetailAPI', 'ProjectWorkExpenseAPI', 'ProjectListBaselineAPI', 'ProjectBaselineDetail',
           'ProjectBaselineDetailAPI', 'ProjectHome', 'ProjectConfig', 'ProjectConfigAPI', 'ProjectExpenseListAPI',
           'ProjectListBaseline', 'ProjectWorkList'
           ]

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
                   'list_from_app': 'project.project.create',
                   'employee_info': request.user.employee_current_data
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
            resp.result['message'] = f'{SaleMsg.PROJECT} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
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
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_CONFIG).get()
        can_close = False
        if resp.state:
            for item in resp.result['person_can_end']:
                item_id = item.get('id', None)
                emp_id = request.user.employee_current_data.get('id', None)
                if item_id and emp_id and (item_id == emp_id):
                    can_close = True
                    break
        return {
                   'dependencies_list': DEPENDENCIES_TYPE,
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
                   'can_close': can_close
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
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_CONFIG).get()
        can_close = False
        if resp.state:
            for item in resp.result['person_can_end']:
                item_id = item.get('id', None)
                emp_id = request.user.employee_current_data.get('id', None)
                if item_id and emp_id and (item_id == emp_id):
                    can_close = True
                    break
        return {
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
                   'dependencies_list': DEPENDENCIES_TYPE,
                   'list_from_app': 'project.project.edit',
                   'employee_info': request.user.employee_current_data,
                   'can_close': can_close
               }, status.HTTP_200_OK


class ProjectEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_EDIT.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
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
            resp.result['message'] = f'{SaleMsg.PROJECT_GROUP} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectGroupListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='pj_group_list')


class ProjectGroupDDListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_DD_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='pj_group_list')


class ProjectGroupDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_DETAIL.push_id(pk)).get(params)
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_DETAIL.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_GROUP} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_GROUP_DETAIL.push_id(pk)).delete()
        if resp.state:
            return {'message': f'{SaleMsg.PROJECT_GROUP} {BaseMsg.DELETE} {BaseMsg.SUCCESS}'}, status.HTTP_200_OK
        return resp.auto_return()


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
            resp.result['message'] = f'{SaleMsg.PROJECT_WORK} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectWorkList(View):
    @mask_view(
        auth_require=True,
        template='sales/project/extends/work-list.html',
        breadcrumb='PROJECT_WORKS',
        menu_active='menu_works_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectWorkListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='pj_work_list')


class ProjectWorkDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_DETAIL.push_id(pk)).get(params)
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_DETAIL.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_WORK} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_DETAIL.push_id(pk)).delete()
        if resp.state:
            return {'message': f'{SaleMsg.PROJECT_WORK} {BaseMsg.DELETE} {BaseMsg.SUCCESS}'}, status.HTTP_200_OK
        return resp.auto_return()


class ProjectMemberAddAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, pk_pj, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_MEMBER_ADD.fill_key(pk=pk_pj)).post(data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_MEMBER} {BaseMsg.ADDED}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectMemberDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk_pj, pk_member, *args, **kwargs):
        resp = ServerAPI(
            user=request.user, url=ApiURL.PROJECT_MEMBER_DETAIL.fill_key(pk=pk_pj, pk_member=pk_member)
        ).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk_pj, pk_member, *args, **kwargs):
        resp = ServerAPI(
            user=request.user, url=ApiURL.PROJECT_MEMBER_DETAIL.fill_key(pk=pk_pj, pk_member=pk_member)
        ).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_MEMBER} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk_pj, pk_member, *args, **kwargs):
        resp = ServerAPI(
            user=request.user, url=ApiURL.PROJECT_MEMBER_DETAIL.fill_key(pk=pk_pj, pk_member=pk_member)
        ).delete()
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_MEMBER} {BaseMsg.DELETE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectUpdateOrderAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk_pj, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_UPDATE_ORDER.fill_key(pk=pk_pj)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectTaskListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        url = ApiURL.PROJECT_TASK_LIST
        resp = ServerAPI(user=request.user, url=url).get(params)
        return resp.auto_return(key_success='prj_task_list')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_TASK_LIST.fill_key(pk_pj=data['project'])).post(data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT_ASSIGN_TASK} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectTaskDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_TASK_LINK.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.PROJECT} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectWorkExpenseAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_WORK_EXPENSE_LIST).get(params)
        return resp.auto_return(key_success='work_expense_list')


class ProjectExpenseListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_EXPENSE_LIST).get(params)
        return resp.auto_return(key_success='project_expense_list')


class ProjectListBaseline(View):
    @mask_view(
        auth_require=True,
        template='sales/project/extends/baseline-list.html',
        breadcrumb='PROJECT_BASELINE',
        menu_active='menu_baseline_list',
        jsi18n='project_home'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectListBaselineAPI(APIView):

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_BASELINE).get(params)
        return resp.auto_return(key_success='baseline_list')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_BASELINE).post(request.data)
        if resp.state:
            resp.result['message'] = f'{SaleMsg.BASELINE} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ProjectBaselineDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/project/extends/detail-baseline.html',
        breadcrumb='PROJECT_DETAIL_PAGE',
        menu_active='menu_project',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'dependencies_list': DEPENDENCIES_TYPE,
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
               }, status.HTTP_200_OK


class ProjectBaselineDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_BASELINE_DETAIL.push_id(pk)).get()
        return resp.auto_return()


class ProjectHome(View):
    @mask_view(
        auth_require=True,
        template='sales/project/extends/home.html',
        breadcrumb='PROJECT_HOME',
        menu_active='id_menu_project_home',
        jsi18n='project_home',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectConfig(View):
    @mask_view(
        auth_require=True,
        template='sales/project/extends/configs.html',
        breadcrumb='PROJECT_CONFIG',
        menu_active='menu_project_config',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectConfigAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_CONFIG).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PROJECT_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = f'{BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


