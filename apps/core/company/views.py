from django.conf import settings
from django.views import View
from requests_toolbelt import MultipartEncoder
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import get_connection

from apps.core.account.models import Company
from apps.shared import mask_view, ApiURL, ServerAPI, TypeCheck


class CompanyList(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_list.html',
        breadcrumb='COMPANY_LIST_PAGE',
        menu_active='menu_company_list',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'ui_domain': settings.UI_DOMAIN
        }
        return ctx, status.HTTP_200_OK


class CompanyCreate(View):
    @classmethod
    def callback_success(cls, result):
        return {'company': result, 'icon': result["title"][0]}

    @mask_view(
        auth_require=True,
        template='core/company/company_create.html',
        breadcrumb='COMPANY_CREATE_PAGE',
        menu_active='menu_company_create'
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.BASE_CURRENCY).get()
        vnd_currency = {}
        for item in resp.result:
            if item['code'] == 'VND':
                vnd_currency = item
        return {
                   'data': {'VND_currency': vnd_currency}
               }, status.HTTP_200_OK


class CompanyDetail(View):
    @classmethod
    def callback_success(cls, result):
        return {'company': result, 'icon': result["title"][0]}

    @mask_view(
        auth_require=True,
        template='core/company/company_detail.html',
        breadcrumb='COMPANY_DETAIL_PAGE',
        menu_active='menu_company_detail'
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CompanyUpdate(View):
    @classmethod
    def callback_success(cls, result):
        return {'company': result, 'icon': result["title"][0]}

    @mask_view(
        auth_require=True,
        template='core/company/company_update.html',
        breadcrumb='COMPANY_UPDATE_PAGE',
        menu_active='menu_company_update'
    )
    def get(self, request, pk, *args, **kwargs):
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


class CompanyDetailAPI(APIView):
    @classmethod
    def callback_success(cls, result):
        return {'company': result, 'icon': result["title"][0]}

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).get()
        return resp.auto_return(key_success='company_detail')

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        try:
            connection = get_connection(
                username=request.data.get('email'),
                password=request.data.get('email_app_password'),
                fail_silently=False,
            )
            if connection.open():
                if request.data.get('email_app_password') == '':
                    request.data['email_app_password_status'] = False
                else:
                    request.data['email_app_password_status'] = True

                resp = ServerAPI(
                    request=request, user=request.user, url=ApiURL.COMPANY_DETAIL.push_id(pk)
                ).put(request.data)
                return resp.auto_return()
        except Exception as e:
            print(e)
            request.data['email_app_password_status'] = False
            resp = ServerAPI(
                request=request, user=request.user, url=ApiURL.COMPANY_DETAIL.push_id(pk)
            ).put(request.data)
            return resp.auto_return()


class CompanyLogoUpload(APIView):
    parser_classes = [MultiPartParser]

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, pk, *args, **kwargs):
        uploaded_file = request.FILES.get('file')
        m = MultipartEncoder(
            fields={
                'logo': (uploaded_file.name, uploaded_file, uploaded_file.content_type),
            }
        )
        resp = ServerAPI(
            request=request, user=request.user, url=ApiURL.COMPANY_DETAIL_LOGO.fill_key(pk=pk),
            cus_headers={
                'content-type': m.content_type,
            }
        ).post(data=m)
        return resp.auto_return(key_success='company_logo_detail')


class CompanyDeleteAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).delete(request.data)
        return resp.auto_return()


class CompanyListOverviewList(View):
    @mask_view(
        auth_require=True,
        template='core/company/company_overview/company_overview_list.html',
        breadcrumb='COMPANY_OVERVIEW_PAGE',
        menu_active='menu_company_overview_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_LIST).get()
        return resp.auto_return(key_success='company_list')


class CompanyListOverviewListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_OVERVIEW).get()
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
            resp = ServerAPI(request=request, user=request.user, url=url).get()
            return resp.auto_return(key_success='data_list')
        return {}, status.HTTP_404_NOT_FOUND

    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if TypeCheck.check_uuid(pk):
            url = ApiURL.ACCOUNT_USER_COMPANY.push_id(pk)
            resp = ServerAPI(request=request, user=request.user, url=url).put(request.data)
            return resp.auto_return()
        return {}, status.HTTP_404_NOT_FOUND


class CompanyUserNotMapEmployeeListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_USER_NOT_MAP_EMPLOYEE).get()
        return resp.auto_return(key_success='company_user_list')


class EmployeeOfTenantListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        query_params = request.query_params.dict()
        company_id = query_params.get('company_id', None)
        user_is_null = query_params.get('user_is_null', None)
        if company_id:
            filter_data = {'company_id': company_id}
            if user_is_null and user_is_null is not None and user_is_null not in ['null', 'None']:
                user_is_null = TypeCheck.get_bool(user_is_null)
                filter_data['user__isnull'] = user_is_null
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.EMPLOYEE_TENANT, is_minimal=False).get(
                data=filter_data
            )
            return resp.auto_return(key_success='employee_list')
        return {'employee_list': []}, status.HTTP_200_OK


class CompanyConfigDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_CONFIG).get()
        return resp.auto_return(key_success='config')

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.COMPANY_CONFIG).put(data=request.data)
        if resp.state:
            sub_domain = request.data.get('sub_domain', None)
            if sub_domain:
                company_id = request.user.company_current_data.get('id', None)
                if company_id:
                    try:
                        company_obj = Company.objects.get(pk=company_id)
                        company_obj.sub_domain = sub_domain
                        company_obj.save()
                    except Company.DoesNotExist:
                        pass
        return resp.auto_return()


class TestEmailConnection(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        try:
            connection = get_connection(
                username=request.GET.get('email'),
                password=request.GET.get('email_app_password'),
                fail_silently=False,
            )
            if connection.open():
                if request.data.get('email_app_password') == '':
                    return {}, status.HTTP_502_BAD_GATEWAY
                else:
                    return {}, status.HTTP_200_OK
        except Exception as e:
            print(e)
            return {}, status.HTTP_502_BAD_GATEWAY
