import json

from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL
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

# PAYMENT PLAN
class PaymentPlanList(View):

    @mask_view(
        auth_require=True,
        template='sales/report/report_cashflow.html',
        menu_active='menu_report_cashflow_list',
        breadcrumb='REPORT_CASHFLOW_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'filter_quarter': FILTER_QUARTER, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK


class PaymentPlanListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_CASHFLOW_LIST).get(data)
        return resp.auto_return(key_success='report_cashflow_list')
