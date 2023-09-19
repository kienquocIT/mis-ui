from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.shared import mask_view, ServerAPI, ApiURL


# Create your views here.

class TenantInformation(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/tenant/tenant_information.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TenantInformationAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TENANT).get()
        return resp.auto_return(key_success='tenant')


class TenantPlanListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.TENANT_PLAN_LIST, user=request.user).get()
        return resp.auto_return(key_success='tenant_plan_list')


class TenantDiagramView(View):
    @mask_view(
        login_require=True,
        auth_require=False,
        template='core/tenant/diagram.html',
        breadcrumb='COMPANY_DIAGRAM',
        menu_active='menu_company_diagram',
    )
    def get(self, request, *args, **kwargs):
        # {
        #                    'org_chart': {
        #                        'id': '1',
        #                        'name': 'Tap Doan A',
        #                        'title': '**',
        #                        'children': [
        #                            {
        #                                'id': '2',
        #                                'name': 'Cong Ty A',
        #                                'title': '**',
        #                                'children': [
        #                                    {
        #                                        'id': '',
        #                                        'name': 'Phòng Mua Hàng 1',
        #                                        'title': '**',
        #                                        'children': [
        #                                            {
        #                                                'id': '',
        #                                                'name': 'Nguyễn Văn A',
        #                                                'title': 'Chuyên Viên Bán Hàng Level 1, Chuyên Viên Tư Vấn 2',
        #                                                'avatar':
        #                                                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        #                                            },
        #                                            {
        #                                                'id': '',
        #                                                'name': 'Tran Van B ',
        #                                                'title': 'Chuyên Viên Bán Hàng Level 1, Chuyên Viên Tư Vấn 2',
        #                                                'avatar':
        #                                                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        #                                            },
        #                                        ],
        #                                    },
        #                                ],
        #                            },
        #                            {
        #                                'id': '3',
        #                                'name': 'Cong Ty B',
        #                                'title': '**',
        #                                'children': [
        #                                    {
        #                                        'id': '',
        #                                        'name': 'Phòng Bán Hàng 1',
        #                                        'title': '**',
        #                                    },
        #                                    {
        #                                        'id': '',
        #                                        'name': 'Phòng Bán Hàng 2',
        #                                        'title': '**',
        #                                    },
        #                                    {
        #                                        'id': '',
        #                                        'name': 'Phòng Bán Hàng 3',
        #                                        'title': '**',
        #                                    },
        #                                ],
        #                            },
        #                            {
        #                                'id': '4',
        #                                'name': 'Cong Ty C',
        #                                'title': '**',
        #                                'children': [
        #                                    {
        #                                        'id': '',
        #                                        'name': 'Phòng Nghiên Cứu Thị Trường 1',
        #                                        'title': '**',
        #                                    },
        #                                ],
        #                            },
        #                        ]
        #                    }
        #                }
        return {}, status.HTTP_200_OK


class TenantDiagramAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        if not data.keys():
            data = {'first_current': 1}
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TENANT_DIAGRAM).get(data=data)
        return resp.auto_return(key_success='org_chart')
