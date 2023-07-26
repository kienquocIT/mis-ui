from django.urls import reverse
from django.views import View
from requests_toolbelt import MultipartEncoder
from rest_framework import status
from rest_framework.parsers import MultiPartParser

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, ServerMsg, HRMsg, PermsMsg

BELONG_LIST = [
    {'value': 1, "name": PermsMsg.USER},
    {'value': 2, "name": PermsMsg.USER_STAFF},
    {'value': 3, "name": PermsMsg.ALL_STAFF},
    {'value': 4, "name": PermsMsg.ALL_USER},
]


def create_hr_application(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    elif resp.status == 401:
        return {}, status.HTTP_401_UNAUTHORIZED
    return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


def update_hr_application(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    elif resp.status == 401:
        return {}, status.HTTP_401_UNAUTHORIZED
    return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


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
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.EMPLOYEE_UPLOAD_AVATAR,
            cus_headers={
                'content-type': m.content_type,
            },
        ).post(data=m)
        if resp.state:
            request.user.update_avatar_hash(resp.result.get('media_path_hash', None))
            return {'detail': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class EmployeeCreate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_create.html',
        breadcrumb='EMPLOYEE_CREATE_PAGE',
        menu_active='menu_employee_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class EmployeeDetail(View):

    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_detail.html',
        breadcrumb='EMPLOYEE_DETAIL_PAGE',
        menu_active='menu_employee_list',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {
                       'doc_id': pk,
                   },
                   'belong_list': BELONG_LIST,
                   'app_list': {
                       'url': reverse('TenantApplicationListAPI'),
                       'prefix': 'tenant_application_list',
                   }
               }, status.HTTP_200_OK


class EmployeeUpdate(View):
    @mask_view(
        auth_require=True,
        template='core/hr/employee/employee_update.html',
        breadcrumb='EMPLOYEE_UPDATE_PAGE',
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
        return self.update_hr_application(
            request=request,
            url=ApiURL.EMPLOYEE_DETAIL,
            pk=pk,
            msg=HRMsg.EMPLOYEE_UPDATE
        )

    @classmethod
    def update_hr_application(cls, request, url, pk, msg):
        resp = ServerAPI(user=request.user, url=url + '/' + pk).put(request.data)
        if resp.state:
            resp.result['message'] = msg
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class EmployeeCompanyListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, company_id, *args, **kwargs):
        # resp = ServerAPI(url=(ApiURL.EMPLOYEE_COMPANY + '/' + company_id), user=request.user).get()
        resp = ServerAPI(url=(ApiURL.EMPLOYEE_COMPANY_NEW.fill_key(company_id=company_id)), user=request.user).get()
        resp = ServerAPI(url=(ApiURL.XXX.fill_key(id='xxxx', option='2222')), user=request.user).get()
        if resp.state:
            return {'employee_company_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


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
    def get(self, request, *args, **kwargs):
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
        if role.errors:
            if isinstance(role.errors, dict):
                err_msg = ""
                for _, value in role.errors.items():
                    err_msg += str(value)
                    break
                return {'errors': err_msg}, role.status
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


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
        if role.errors:
            if isinstance(role.errors, dict):
                err_msg = ""
                for _, value in role.errors.items():
                    err_msg += str(value)
                    break
                return {'errors': err_msg}, role.status
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR

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
        resp = ServerAPI(url=ApiURL.GROUP_LIST, user=request.user, request=request).get()
        return resp.auto_return(key_success='group_list')
        # if resp.state:
        #     return {'group_list': resp.result}, status.HTTP_200_OK
        # elif resp.status == 401:
        #     return {}, status.HTTP_401_UNAUTHORIZED
        # return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

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
