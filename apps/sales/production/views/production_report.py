import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg
from apps.shared.constant import SYSTEM_STATUS
from apps.shared.msg import ProductionMsg


PR_TYPE = (
    (0, ProductionMsg.TYPE_FOR_PO),
    (1, ProductionMsg.TYPE_FOR_WO),
)


def create_production_report(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_production_report(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class ProductionReportList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/production/productionreport/production_report_list.html',
        menu_active='menu_production_report_list',
        breadcrumb='PRODUCTION_REPORT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS, 'pr_type': PR_TYPE}, status.HTTP_200_OK


class ProductionReportCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/productionreport/production_report_create.html',
        menu_active='',
        breadcrumb='PRODUCTION_REPORT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        return ctx, status.HTTP_200_OK


class ProductionReportListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_REPORT_LIST).get(data)
        return resp.auto_return(key_success='production_report_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_production_report(
            request=request,
            url=ApiURL.PRODUCTION_REPORT_LIST,
            msg=SaleMsg.PRODUCTION_REPORT_CREATE
        )


class ProductionReportDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/production/productionreport/production_report_detail.html',
        menu_active='menu_production_report_list',
        breadcrumb='PRODUCTION_REPORT_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
               }, status.HTTP_200_OK


class ProductionReportUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/productionreport/production_report_update.html',
        menu_active='menu_production_report_list',
        breadcrumb='PRODUCTION_REPORT_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
        }
        return ctx, status.HTTP_200_OK


class ProductionReportDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_REPORT_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_production_report(
            request=request,
            url=ApiURL.PRODUCTION_REPORT_DETAIL,
            pk=pk,
            msg=SaleMsg.PRODUCTION_REPORT_UPDATE
        )


class ProductionReportDDListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_REPORT_DD_LIST).get(data)
        return resp.auto_return(key_success='production_report_dd')


class ProductionReportGRListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCTION_REPORT_GR_LIST).get(data)
        return resp.auto_return(key_success='production_report_gr')
