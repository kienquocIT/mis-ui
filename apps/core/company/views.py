from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ApiURL, ServerAPI, ServerMsg, TypeCheck


class CompanyList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='core/company/company_list.html',
        breadcrumb='COMPANY_LIST_PAGE',
        menu_active='menu_company_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CompanyListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).get()
        if resp.state:
            return {'company_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        return response.errors, response.status


class CompanyListOverviewList(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_overview/company_overview_list.html',
        breadcrumb='COMPANY_OVERVIEW_PAGE',
        menu_active='menu_company_overview_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CompanyListOverviewListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_OVERVIEW).get()
        if resp.state:
            return {'company_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class CompanyListOverviewDetail(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_overview/company_overview_detail.html',
        breadcrumb='COMPANY_OVERVIEW_DETAIL_PAGE',
        menu_active='menu_company_overview_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).get()
        if resp.state:
            return {'company_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class EmployeeUserByCompanyListOverviewDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        company_id = kwargs.get('pk', None)
        if company_id and TypeCheck.check_uuid(company_id):
            resp = ServerAPI(
                user=request.user,
                url=ApiURL.EMPLOYEE_BY_COMPANY_OVERVIEW.push_id(company_id)
            ).get()
            if resp.state:
                return {'data_list': resp.result}, status.HTTP_200_OK
            elif resp.status == 401:
                return {}, status.HTTP_401_UNAUTHORIZED
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

        return {}, status.HTTP_404_NOT_FOUND
