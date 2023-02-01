from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, ServerMsg


class EmployeeList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_list.html',
        breadcrumb='EMPLOYEE_LIST_PAGE',
        menu_active='menu_employee_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EmployeeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.EMPLOYEE_LIST, user=request.user).get()
        if resp.state:
            return {'employee_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            response = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_LIST).post(data)
            if response.state:
                return response.result, status.HTTP_200_OK
            else:
                if response.errors:
                    if isinstance(response.errors, dict):
                        err_msg = ""
                        for key, value in response.errors.items():
                            err_msg += str(key) + ": " + str(value)
                            break
                        return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class EmployeeCreate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_create.html',
        breadcrumb='EMPLOYEE_CREATE_PAGE',
        menu_active='menu_employee_list',
    )
    def get(self, request, *args, **kwargs):
        return {}


class EmployeeDetail(View):

    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_detail.html',
        menu_active='menu_employee_list',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class EmployeeDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_DETAIL + '/' + pk).get()
        if resp.state:
            return {'employee': resp.result}, status.HTTP_200_OK
        return {'detail': resp.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        res = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_DETAIL + '/' + pk).put(data)
        if res.state:
            return res.result, status.HTTP_200_OK
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST


# Role
class RoleList(View):

    @mask_view(
        auth_require=True,
        template='core/hr/role/list_role.html',
        breadcrumb='ROLE_LIST_PAGE',
        menu_active='menu_role_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleCreate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/role/create_role.html',
        breadcrumb="ROLE_CREATE_PAGE",
        menu_active='menu_role_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleDetail(View):
    @mask_view(
        auth_require=True,
        template='core/hr/role/update_role.html',
        menu_active='menu_role_list',
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RoleListAPI(APIView):

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        role_list = ServerAPI(user=request.user, url=ApiURL.ROLE_LIST).get()
        if role_list.state:
            return {'role_list': role_list.result}, status.HTTP_200_OK
        return {'detail': role_list.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_LIST).post(data)
        if role.state:
            return role.result, status.HTTP_200_OK
        return {'errors': role.errors}, status.HTTP_400_BAD_REQUEST


class RoleDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
        menu_active='menu_role_list',
    )
    def get(self, request, pk, *args, **kwargs):
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_DETAIL + '/' + pk).get()
        if role.state:
            return {'role': role.result}, status.HTTP_200_OK
        return {'errors': role.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_DETAIL + '/' + pk).put(data)
        if role.state:
            return role.result, status.HTTP_200_OK
        return {'errors': role.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        role = ServerAPI(user=request.user, url=ApiURL.ROLE_DETAIL + '/' + pk).delete(request.data)
        if role.state:
            return {}, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


# Group Level
class GroupLevelList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/grouplevel/level_list.html',
        breadcrumb='GROUP_LEVEL_LIST_PAGE',
        menu_active='menu_group_list',
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
        resp = ServerAPI(url=ApiURL.GROUP_LEVEL_LIST, user=request.user).get()
        if resp.state:
            return {'group_level_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            response = ServerAPI(user=request.user, url=ApiURL.GROUP_LEVEL_LIST).post(data)
            if response.state:
                return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


# Group
class GroupCreate(View):

    @mask_view(
        auth_require=True,
        template='core/hr/group/group_create.html',
        menu_active='menu_group_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GroupList(View):
    @mask_view(
        auth_require=True,
        template='core/hr/group/group_list.html',
        breadcrumb='GROUP_LIST_PAGE',
        menu_active='menu_group_list',
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
        resp = ServerAPI(url=ApiURL.GROUP_LIST, user=request.user).get()
        if resp.state:
            return {'group_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = request.data
            response = ServerAPI(user=request.user, url=ApiURL.GROUP_LIST).post(data)
            if response.state:
                return response.result, status.HTTP_200_OK
            else:
                if response.errors:
                    if isinstance(response.errors, dict):
                        err_msg = ""
                        for key, value in response.errors.items():
                            err_msg += str(key) + ": " + str(value)
                            break
                        return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class GroupDetail(View):

    @mask_view(
        auth_require=True,
        template='core/hr/group/group_detail.html',
        menu_active='menu_group_list',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class GroupUpdate(View):

    @mask_view(
        auth_require=True,
        template='core/hr/group/group_update.html',
        menu_active='menu_group_list',
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
        resp = ServerAPI(user=request.user, url=ApiURL.GROUP_DETAIL + '/' + pk).get()
        if resp.state:
            return {'group': resp.result}, status.HTTP_200_OK
        return {'detail': resp.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.GROUP_DETAIL + '/' + pk).put(data)
        if resp.state:
            return resp.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def delete(self, request, pk, *args, **kwargs):
        if request.method == 'DELETE':
            response = ServerAPI(user=request.user, url=ApiURL.GROUP_DETAIL + '/' + pk).delete(request.data)
            if response.state:
                return {}, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class GroupParentListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, level, *args, **kwargs):
        resp = ServerAPI(url=(ApiURL.GROUP_PARENT + '/' + level), user=request.user).get()
        if resp.state:
            return {'group_parent_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
