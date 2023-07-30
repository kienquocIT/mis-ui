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
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_LIST).get()
        return resp.auto_return(key_success='company_list')

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_LIST).post(request.data)
        return resp.auto_return()


class CompanyDetail(View):
    @classmethod
    def callback_success(cls, result):
        return {'company': result, 'icon': result["title"][0]}

    @mask_view(
        auth_require=True,
        template='core/company/company_detail.html',
        breadcrumb='COMPANY_LIST_PAGE',
        menu_active='menu_company_list'
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).get()
        return resp.auto_return(callback_success=self.callback_success)


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
    @classmethod
    def callback_success(cls, result):
        return {'company': result, 'icon': result["title"][0]}

    @mask_view(auth_require=True, template='core/company/company_update.html', breadcrumb='COMPANY_LIST_PAGE')
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).get()
        return resp.auto_return(callback_success=self.callback_success)

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).put(request.data)
        return resp.auto_return()


class CompanyDeleteAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).delete(request.data)
        return resp.auto_return()


class CompanyListOverviewList(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_overview/company_overview_list.html',
        breadcrumb='COMPANY_OVERVIEW_PAGE',
        menu_active='menu_company_overview_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_LIST).get()
        return resp.auto_return(key_success='company_list')


class CompanyListOverviewListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_OVERVIEW).get()
        return resp.auto_return(key_success='company_list')


class EmployeeUserByCompanyListOverviewDetailAPI(APIView):
    @classmethod
    def get_data_list(cls, user, url):
        resp = ServerAPI(user=user, url=url).get()
        return resp.auto_return()

    @classmethod
    def get_data_list_with_post(cls, user, url, data):
        resp = ServerAPI(user=user, url=url).post(data)
        return resp.auto_return()

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
            url = ApiURL.COMPANY_OVERVIEW.push_id(company_id) + '/0'
            resp = ServerAPI(user=request.user, url=url).get()
            return resp.auto_return(key_success='data_list')
        return {}, status.HTTP_404_NOT_FOUND

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.ACCOUNT_USER_COMPANY.push_id(pk)
            resp = ServerAPI(user=request.user, url=url).put(request.data)
            return resp.auto_return()
        return {}, status.HTTP_404_NOT_FOUND


class CompanyUserNotMapEmployeeListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_USER_NOT_MAP_EMPLOYEE, request=request).get()
        return resp.auto_return(key_success='company_user_list')


class EmployeeOfTenantListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        query_params = request.query_params.dict()
        company_id = query_params.get('company_id', None)
        user_is_null = query_params.get('user_is_null', None)
        if company_id:
            filter_data = {'company_id': company_id}
            if user_is_null is not None:
                user_is_null = TypeCheck.get_bool(user_is_null)
                filter_data['user__isnull'] = user_is_null
            resp = ServerAPI(user=request.user, url=ApiURL.EMPLOYEE_TENANT, is_minimal=False).get(
                data=filter_data
            )
            return resp.auto_return(key_success='employee_list')
        return {'employee_list': []}, status.HTTP_200_OK


class CompanyConfigDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_CONFIG).get()
        return resp.auto_return(key_success='config')

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.COMPANY_CONFIG).put(data=request.data)
        return resp.auto_return()
