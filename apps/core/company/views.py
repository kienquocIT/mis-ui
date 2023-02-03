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
        elif resp.status == 403:
            return {}, status.HTTP_403_FORBIDDEN
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        return response.errors, response.status


class CompanyDetail(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_detail.html',
        breadcrumb='COMPANY_LIST_PAGE',
        menu_active='menu_company_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CompanyDetailAPI(APIView):
    @mask_view(auth_require=True, template='core/company/company_detail.html', breadcrumb='COMPANY_LIST_PAGE')
    def get(self, request, pk, *args, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).get()
        if response.state:
            return {'company': response.result, 'icon': response.result["title"][0]}, status.HTTP_200_OK
        return {'detail': response.errors}, status.HTTP_401_UNAUTHORIZED


class CompanyUpdate(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_update.html',
        breadcrumb='COMPANY_LIST_PAGE',
        menu_active='menu_company_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CompanyUpdateAPI(APIView):
    @mask_view(auth_require=True, template='core/company/company_update.html', breadcrumb='COMPANY_LIST_PAGE')
    def get(self, request, pk, *args, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).get()
        if response.state:
            return {'company': response.result, 'icon': response.result["title"][0]}, status.HTTP_200_OK
        return {'detail': response.errors}, status.HTTP_401_UNAUTHORIZED

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).put(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class CompanyDeleteAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).delete(request.data)
        if response.state:
            return {}, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


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
            print('company_list:', resp.result)
            return {'company_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class EmployeeUserByCompanyListOverviewDetailAPI(APIView):
    @classmethod
    def get_data_list(cls, user, url):
        resp = ServerAPI(user=user, url=url).get()
        if resp.state:
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @classmethod
    def get_data_list_with_post(cls, user, url, data):
        resp = ServerAPI(user=user, url=url).post(data)
        if resp.state:
            return resp.result, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @classmethod
    def parse_data(cls, emp_data, user_data):
        return emp_data + user_data

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        company_id = kwargs.get('pk', None)
        if company_id and TypeCheck.check_uuid(company_id):
            resp = ServerAPI(
                user=request.user,
                url=ApiURL.EMPLOYEE_BY_COMPANY_OVERVIEW.fill_key(company_id=company_id)
            ).get()
            if resp.state:
                return {'data_list': resp.result}, status.HTTP_200_OK
            elif resp.status == 401:
                return {}, status.HTTP_401_UNAUTHORIZED
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {}, status.HTTP_404_NOT_FOUND


class EmployeeByCompanyListOverviewDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        company_id = kwargs.get('pk', None)
        if company_id and TypeCheck.check_uuid(company_id):
            resp = ServerAPI(
                user=request.user,
                url=ApiURL.EMPLOYEE_BY_COMPANY_OVERVIEW.fill_key(company_id=company_id)
            ).get({'ordering': 'employee__first_name'})
            if resp.state:
                return resp.get_full_data(), status.HTTP_200_OK
            elif resp.status == 401:
                return {}, status.HTTP_401_UNAUTHORIZED
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
        return {}, status.HTTP_404_NOT_FOUND


class CompanyUserNotMapEmployeeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_USER_NOT_MAP_EMPLOYEE).get()
        if resp.state:
            return {'company_user_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

