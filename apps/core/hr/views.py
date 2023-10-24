import uuid
from typing import Literal

from django.urls import reverse
from django.views import View
from requests_toolbelt import MultipartEncoder
from rest_framework import status
from rest_framework.parsers import MultiPartParser

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck, HRMsg, PermsMsg, TypeCheck
from apps.shared.apis import RespData

BELONG_LIST = [
    {'value': 1, "name": PermsMsg.USER},
    {'value': 2, "name": PermsMsg.USER_STAFF},
    {'value': 3, "name": PermsMsg.ALL_STAFF},
    {'value': 4, "name": PermsMsg.ALL_USER},
]


def create_hr_application(request, url, msg):
    resp = ServerAPI(request=request, user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_hr_application(request, url, pk, msg):
    resp = ServerAPI(request=request, user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class EmployeeList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_list.html',
        breadcrumb='EMPLOYEE_LIST_PAGE',
        menu_active='menu_employee_list',
        perm_check=PermCheck(url=ApiURL.EMPLOYEE_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EmployeeListAPI(APIView):
    @classmethod
    def params_custom(cls, request):
        params = request.query_params.dict()
        if 'group__id' in params and not isinstance(
                params['group__id'], uuid.UUID
        ) and request.user.employee_current_data.get('group', None):
            params['group__id'] = request.user.employee_current_data.get('group')
        return params

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        params = self.params_custom(request)
        resp = ServerAPI(request=request, url=ApiURL.EMPLOYEE_LIST, user=request.user).get(params)
        return resp.auto_return(key_success='employee_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_hr_application(
            request=request,
            url=ApiURL.EMPLOYEE_LIST,
            msg=HRMsg.EMPLOYEE_CREATE
        )


class EmployeeUploadAvatarAPI(APIView):
    parser_classes = [MultiPartParser]

    @mask_view(auth_require=True, login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('file')
        m = MultipartEncoder(fields={'file': (uploaded_file.name, uploaded_file, uploaded_file.content_type)})
        url = ApiURL.EMPLOYEE_UPLOAD_AVATAR
        headers = {'content-type': m.content_type}
        resp = ServerAPI(request=request, user=request.user, url=url, cus_headers=headers).post(data=m)
        if resp.state:
            request.user.update_avatar_hash(resp.result.get('media_path_hash', None))
            return {'detail': resp.result}, status.HTTP_200_OK
        return resp.auto_return()


class EmployeeCreate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_create.html',
        breadcrumb='EMPLOYEE_CREATE_PAGE',
        menu_active='menu_employee_list',
        perm_check=PermCheck(url=ApiURL.EMPLOYEE_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return ServerAPI.empty_200()


class EmployeeDetail(View):

    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_detail.html',
        breadcrumb='EMPLOYEE_DETAIL_PAGE',
        menu_active='menu_employee_list',
        perm_check=PermCheck(url=ApiURL.EMPLOYEE_DETAIL_PK, method='GET', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {
                'doc_id': pk,
            },
            'belong_list': BELONG_LIST,
            'app_list': {
                'url': reverse('TenantApplicationListAPI'),
                'prefix': 'tenant_application_list',
            }
        }
        return ctx, status.HTTP_200_OK


class PlanAppGetAppListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        url = None
        data = {}
        query_params = request.query_params.dict()

        get_from: Literal['employee', 'role', 'opportunity', 'project'] = query_params.get('get_from', None)
        if get_from == 'employee':
            url = ApiURL.EMPLOYEE_DETAIL_APP_LIST.fill_key(pk=pk)
        elif get_from == 'role':
            url = ApiURL.ROLE_DETAIL_APP_LIST.fill_key(pk=pk)
        elif get_from == 'opportunity':
            opp_id = query_params.get('opportunity', None)
            if opp_id and TypeCheck.check_uuid(opp_id):
                data = {'opportunity': opp_id}
                url = ApiURL.EMPLOYEE_APPLICATION_ALL_LIST.fill_key(pk=pk)
        elif get_from == 'project':
            prj_id = query_params.get('project', None)
            if prj_id and TypeCheck.check_uuid(prj_id):
                data = {'project': prj_id}
                url = ApiURL.EMPLOYEE_APPLICATION_ALL_LIST.fill_key(pk=pk)

        if url:
            resp = ServerAPI(request=request, user=request.user, url=url).get(data=data)
            return resp.auto_return(key_success='app_list')
        return RespData.resp_200(data=[])


class EmployeeUpdate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_update.html',
        breadcrumb='EMPLOYEE_UPDATE_PAGE',
        menu_active='menu_employee_list',
        perm_check=PermCheck(url=ApiURL.EMPLOYEE_DETAIL_PK, method='PUT', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {'data': {'doc_id': pk}}
        return ctx, status.HTTP_200_OK


class EmployeeDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        url = ApiURL.EMPLOYEE_DETAIL_PK.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='employee')

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        return self.update_hr_application(
            request=request,
            url=ApiURL.EMPLOYEE_DETAIL,
            pk=pk,
            msg=HRMsg.EMPLOYEE_UPDATE
        )

    @classmethod
    def update_hr_application(cls, request, url, pk, msg):
        resp = ServerAPI(request=request, user=request.user, url=url + '/' + pk).put(request.data)
        if resp.state:
            resp.result['message'] = msg
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class EmployeeCompanyListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, url=ApiURL.EMPLOYEE_COMPANY_LIST, user=request.user).get(data)
        return resp.auto_return(key_success='employee_company_list')


# Role
class RoleList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/role/role_list.html',
        breadcrumb='ROLE_LIST_PAGE',
        menu_active='menu_role_list',
        perm_check=PermCheck(url=ApiURL.ROLE_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleCreate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/role/role_create.html',
        breadcrumb="ROLE_CREATE_PAGE",
        menu_active='menu_role_list',
        perm_check=PermCheck(url=ApiURL.ROLE_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleUpdateView(View):
    @mask_view(
        auth_require=True,
        template='core/hr/role/role_update.html',
        breadcrumb="ROLE_UPDATE_PAGE",
        menu_active='menu_role_list',
        perm_check=PermCheck(url=ApiURL.ROLE_DETAIL_PK, method='PUT', fill_key=['pk']),
    )
    def get(self, request, *args, pk, **kwargs):
        return {}, status.HTTP_200_OK


class RoleUpdateAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ROLE_DETAIL_PK.fill_key(pk=pk)).put(
            request.data
        )
        return resp.auto_return()


class RoleDetail(View):
    @mask_view(
        auth_require=True,
        template='core/hr/role/role_detail.html',
        breadcrumb="ROLE_DETAIL_PAGE",
        menu_active='menu_role_list',
        perm_check=PermCheck(url=ApiURL.ROLE_DETAIL_PK, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        role_list = ServerAPI(request=request, user=request.user, url=ApiURL.ROLE_LIST).get()
        return role_list.auto_return(key_success='role_list')

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ROLE_LIST).post(request.data)
        return resp.auto_return()


class RoleDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
        menu_active='menu_role_list',
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ROLE_DETAIL_PK.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='role')

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        url = ApiURL.ROLE_DETAIL_PK.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
        return resp.auto_return()

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        url = ApiURL.ROLE_DETAIL_PK.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).delete(request.data)
        return resp.auto_return()


# Group Level
class GroupLevelList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/grouplevel/level_list.html',
        breadcrumb='GROUP_LEVEL_LIST_PAGE',
        menu_active='menu_group_list',
        perm_check=PermCheck(url=ApiURL.ROLE_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupLevelListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.GROUP_LEVEL_LIST, user=request.user).get()
        return resp.auto_return(key_success='group_level_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_hr_application(
            request=request,
            url=ApiURL.GROUP_LEVEL_LIST,
            msg=HRMsg.GROUP_LEVEL_CREATE
        )


class GroupLevelDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_hr_application(
            request=request,
            url=ApiURL.GROUP_LEVEL_DETAIL,
            pk=pk,
            msg=HRMsg.GROUP_LEVEL_UPDATE
        )


# Group
class GroupCreate(View):

    @mask_view(
        auth_require=True,
        template='core/hr/group/group_create.html',
        breadcrumb='GROUP_CREATE',
        menu_active='menu_group_list',
        perm_check=PermCheck(url=ApiURL.GROUP_LIST, method='POST'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/group/group_list.html',
        breadcrumb='GROUP_LIST_PAGE',
        menu_active='menu_group_list',
        perm_check=PermCheck(url=ApiURL.GROUP_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.GROUP_LIST, user=request.user).get()
        return resp.auto_return(key_success='group_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_hr_application(
            request=request,
            url=ApiURL.GROUP_LIST,
            msg=HRMsg.GROUP_CREATE
        )


class GroupDetail(View):
    @mask_view(
        auth_require=True,
        template='core/hr/group/group_detail.html',
        breadcrumb='GROUP_DETAIL',
        menu_active='menu_group_list',
        perm_check=PermCheck(url=ApiURL.GROUP_DETAIL_PK, method='GET', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class GroupUpdate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/group/group_update.html',
        breadcrumb='GROUP_UPDATE',
        menu_active='menu_group_list',
        perm_check=PermCheck(url=ApiURL.GROUP_DETAIL_PK, method='PUT', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class GroupDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        url = ApiURL.GROUP_DETAIL_PK.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).get()
        return resp.auto_return(key_success='group')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, pk, *args, **kwargs):
        return EmployeeDetailAPI.update_hr_application(
            request=request,
            url=ApiURL.GROUP_DETAIL,
            pk=pk,
            msg=HRMsg.GROUP_UPDATE
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        url = ApiURL.GROUP_DETAIL_PK.fill_key(pk=pk)
        resp = ServerAPI(request=request, user=request.user, url=url).delete(request.data)
        return resp.auto_return()
