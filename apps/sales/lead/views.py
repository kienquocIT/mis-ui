from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg
from apps.shared.constant import COMPANY_SIZE, CUSTOMER_REVENUE, LEAD_STATUS


class LeadList(View):
    @mask_view(
        auth_require=True,
        template='sales/lead/lead_list.html',
        breadcrumb='LEAD_LIST_PAGE',
        menu_active='menu_lead_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class LeadCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/lead/lead_create.html',
        breadcrumb='LEAD_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'company_size': COMPANY_SIZE,
            'customer_revenue': CUSTOMER_REVENUE,
            'lead_status': LEAD_STATUS
        }, status.HTTP_200_OK


class LeadDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/lead/lead_detail.html',
        breadcrumb='LEAD_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'company_size': COMPANY_SIZE,
            'customer_revenue': CUSTOMER_REVENUE,
            'lead_status': LEAD_STATUS
        }, status.HTTP_200_OK


class LeadUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/lead/lead_update.html',
        breadcrumb='LEAD_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class LeadListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_LIST).get(params)
        return resp.auto_return(key_success='lead_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.LEAD_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class LeadDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='lead_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.LEAD_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
