from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ApiURL, ServerAPI, ServerMsg


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
        return {}, status.HTTP_200_OK


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
    @mask_view(auth_require=True, template='core/company/company_detail.html')
    def get(self, request, pk, *args, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.COMPANY_DETAIL + '/' + pk).get()
        if response.state:
            return {'company': response.result, 'icon': response.result["title"][0]}, status.HTTP_200_OK
        return {'detail': response.errors}, status.HTTP_401_UNAUTHORIZED


class CompanyUpdateAPI(APIView):
    @mask_view(auth_require=True, template='core/company/company_update.html')
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
