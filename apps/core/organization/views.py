from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL

from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, ServerMsg


# Group Level
class GroupLevelList(View):
    @mask_view(
        auth_require=True,
        template='core/organization/grouplevel/level_list.html',
        breadcrumb='GROUP_LEVEL_LIST_PAGE',
        menu_active='menu-employee-list',
    )
    def get(self, request, *args, **kwargs):
        return {}


class GroupLevelListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.GROUP_LEVEL_LIST, user=request.user).get()
        if resp.state:
            return {'group_level_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class GroupLevelCreate(View):
    @mask_view(
        auth_require=True,
        template='core/organization/grouplevel/level_create.html',
        breadcrumb='GROUP_LEVEL_CREATE_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}


# Group
class OrganizationCreate(APIView):

    @mask_view(auth_require=True, template='core/organization/grouplevel/create.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OrganizationCreateAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        # org = ServerAPI(user=request.user, url=ApiURL.user_list).post(data)
        # if org.state:
        #     return org.result, status.HTTP_200_OK

        # return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR

        return {}, status.HTTP_200_OK


class RoleList(View):

    @mask_view(auth_require=True, template='core/organization/role/list_role.html')
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


EMPLOYYEE_LIST = [
    {
        'employee_code': 'EP0015',
        'name': 'Lê Minh',
    }, {
        'employee_code': 'EP0016',
        'name': 'Darlene Robertson',
    },
    {
        'employee_code': 'EP0017',
        'name': 'Esther Howard',
    },
    {
        'employee_code': 'EP0018',
        'name': 'Guy Hawkins',
    },
    {
        'employee_code': 'EP0019',
        'name': 'Brooklyn Simmons',
    },
    {
        'employee_code': 'EP00120',
        'name': 'Nguyễn Văn A',
    },
    {
        'employee_code': 'EP0021',
        'name': 'Nam Nè',
    }
]


class RoleCreate(View):
    @mask_view(auth_require=True, template='core/organization/role/create_role.html')
    def get(self, request, *args, **kwargs):
        return {'employee_list': EMPLOYYEE_LIST}, status.HTTP_200_OK


def get_employee(lst, code):
    name = ''
    for item in lst:
        if item['employee_code'] == code:
            name = item['name']
            break
    return name


class RoleListAPI(APIView):
    ROLE_LIST = [
        {
            'id': 1,
            'role_name': 'Developer',
            'abbreviation': 'DEV',
            'holder': [
                {
                    'employee_code': 'EP0019',
                    'name': get_employee(EMPLOYYEE_LIST, 'EP0019')
                },
            ],
        },
        {
            'id': 2,
            'role_name': 'Business analyst',
            'abbreviation': 'BA',
            'holder': [
                {
                    'employee_code': 'EP0017',
                    'name': get_employee(EMPLOYYEE_LIST, 'EP0017')
                },
                {
                    'employee_code': 'EP0018',
                    'name': get_employee(EMPLOYYEE_LIST, 'EP0018')
                },
            ],
        },
        {
            'id': 3,
            'role_name': 'Tester',
            'abbreviation': 'Test',
            'holder': [
                {
                    'employee_code': 'EP0016',
                    'name': get_employee(EMPLOYYEE_LIST, 'EP0016')
                },
            ],
        }
    ]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        return {'role_list': self.ROLE_LIST}, status.HTTP_200_OK

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        self.ROLE_LIST.append({
            'id': 1,
            'role_name': request.data['role_name'],
            'abbreviation': request.data['abbreviation'],
            'holder': [{'employee_code': i, 'name': get_employee(EMPLOYYEE_LIST, i)} for i in request.data['employee']]
        })
        return request.data, status.HTTP_200_OK

    def put(self, request, *args, **kwargs):
        pass
