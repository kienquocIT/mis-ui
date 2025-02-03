from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties
from apps.shared.constant import COMPANY_SIZE, CUSTOMER_REVENUE, LEAD_STATUS
from apps.shared.msg import BaseMsg


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
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_STAGE_LIST).get()
        return {
            'company_size': COMPANY_SIZE,
            'customer_revenue': CUSTOMER_REVENUE,
            'lead_status': LEAD_STATUS,
            'stage_list': resp.result
        }, status.HTTP_200_OK


class LeadDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/lead/lead_detail.html',
        breadcrumb='LEAD_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_STAGE_LIST).get()
        return {
            'company_size': COMPANY_SIZE,
            'customer_revenue': CUSTOMER_REVENUE,
            'lead_status': LEAD_STATUS,
            'stage_list': resp.result
        }, status.HTTP_200_OK


class LeadUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/lead/lead_update.html',
        breadcrumb='LEAD_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_STAGE_LIST).get()
        return {
            'company_size': COMPANY_SIZE,
            'customer_revenue': CUSTOMER_REVENUE,
            'lead_status': LEAD_STATUS,
            'stage_list': resp.result
        }, status.HTTP_200_OK


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


class LeadChartDataAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_CHART).get(params)
        return resp.auto_return(key_success='chart_data')


class LeadDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_DETAIL.fill_key(pk=pk)).get(params)
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


class LeadListForOpportunityAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_LIST_FOR_OPP).get(params)
        return resp.auto_return(key_success='lead_list')


class LeadCallListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_CALL_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = BaseMsg.SUCCESS
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class LeadCallDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_CALL_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = BaseMsg.SUCCESS
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class LeadEmailListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_EMAIL_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = BaseMsg.SUCCESS
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class LeadMeetingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_MEETING_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = BaseMsg.SUCCESS
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class LeadMeetingDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_MEETING_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = BaseMsg.SUCCESS
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class LeadActivityListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEAD_ACTIVITY_LIST).get(params)
        return resp.auto_return(key_success='lead_activity_list')
