from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg
from apps.shared.msg import ReportMsg

FILTER_QUARTER = (
    (1, ReportMsg.QUARTER_FIRST),
    (2, ReportMsg.QUARTER_SECOND),
    (3, ReportMsg.QUARTER_THIRD),
    (4, ReportMsg.QUARTER_FOURTH),
)

FILTER_MONTH = (
    (1, ReportMsg.MONTH_JANUARY),
    (2, ReportMsg.MONTH_FEBRUARY),
    (3, ReportMsg.MONTH_MARCH),
    (4, ReportMsg.MONTH_APRIL),
    (5, ReportMsg.MONTH_MAY),
    (6, ReportMsg.MONTH_JUNE),
    (7, ReportMsg.MONTH_JULY),
    (8, ReportMsg.MONTH_AUGUST),
    (9, ReportMsg.MONTH_SEPTEMBER),
    (10, ReportMsg.MONTH_OCTOBER),
    (11, ReportMsg.MONTH_NOVEMBER),
    (12, ReportMsg.MONTH_DECEMBER),
)

# REPORT REVENUE
class ReportRevenueList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/report/report_revenue.html',
        menu_active='menu_report_revenue_list',
        breadcrumb='REPORT_REVENUE_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReportRevenueListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_REVENUE_LIST).get(data)
        return resp.auto_return(key_success='report_revenue_list')


# REPORT PRODUCT
class ReportProductList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/report/report_product.html',
        menu_active='menu_report_product_list',
        breadcrumb='REPORT_PRODUCT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReportProductListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_PRODUCT_LIST).get(data)
        return resp.auto_return(key_success='report_product_list')


# REPORT CUSTOMER
class ReportCustomerList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/report/report_customer.html',
        menu_active='menu_report_customer_list',
        breadcrumb='REPORT_CUSTOMER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReportCustomerListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_CUSTOMER_LIST).get(data)
        return resp.auto_return(key_success='report_customer_list')


# REPORT INVENTORY DETAIL
class ReportInventoryDetailList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory_report/items_detail_report.html',
        menu_active='menu_items_detail_report',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {
                'data': {'current_period': resp1.result[0]},
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ReportInventoryDetailListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_INVENTORY_DETAIL_LIST).get(data)
        return resp.auto_return(key_success='report_inventory_detail_list')


# REPORT INVENTORY
class ReportInventoryList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory_report/inventory_report.html',
        menu_active='menu_inventory_report',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {
                'data': {'current_period': resp1.result[0]},
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ReportInventoryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_INVENTORY_LIST).get(data)
        return resp.auto_return(key_success='report_inventory_list')


# REPORT PIPELINE
class ReportPipelineList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/report/report_pipeline.html',
        menu_active='menu_report_pipeline_list',
        breadcrumb='REPORT_PIPELINE_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'filter_quarter': FILTER_QUARTER, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK


class ReportPipelineListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_PIPELINE_LIST).get(data)
        return resp.auto_return(key_success='report_pipeline_list')


# REPORT CASHFLOW
class ReportCashflowList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/report/report_cashflow.html',
        menu_active='menu_report_cashflow_list',
        breadcrumb='REPORT_CASHFLOW_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'filter_quarter': FILTER_QUARTER, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK


class ReportCashflowListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_CASHFLOW_LIST).get(data)
        return resp.auto_return(key_success='report_cashflow_list')
