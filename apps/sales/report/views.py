import qrcode
from datetime import datetime
from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import ReportMsg
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from django.core.cache import cache

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

    @mask_view(
        auth_require=True,
        template='sales/report/report_revenue.html',
        menu_active='menu_report_revenue_list',
        breadcrumb='REPORT_REVENUE_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReportRevenueListAPI(APIView):

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

    @mask_view(
        auth_require=True,
        template='sales/report/report_product.html',
        menu_active='menu_report_product_list',
        breadcrumb='REPORT_PRODUCT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReportProductListAPI(APIView):

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

    @mask_view(
        auth_require=True,
        template='sales/report/report_customer.html',
        menu_active='menu_report_customer_list',
        breadcrumb='REPORT_CUSTOMER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReportCustomerListAPI(APIView):

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
    @mask_view(
        auth_require=True,
        template='sales/inventory_report/items_detail_report.html',
        menu_active='menu_items_detail_report',
        breadcrumb='REPORT_INVENTORY_STOCK_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.COMPANY_CONFIG).get()
        if len(resp1.result) > 0:
            return {
                'data': {
                    'current_period': resp1.result[0],
                    'definition_inventory_valuation': resp2.result['definition_inventory_valuation']
                },
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ReportInventoryDetailListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_INVENTORY_STOCK_LIST).get(data)
        return resp.auto_return(key_success='report_inventory_stock_list')


# REPORT INVENTORY
class ReportInventoryList(View):

    @mask_view(
        auth_require=True,
        template='sales/inventory_report/inventory_report.html',
        menu_active='menu_inventory_report',
        breadcrumb='REPORT_INVENTORY_COST_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        resp2 = ServerAPI(user=request.user, url=ApiURL.COMPANY_CONFIG).get()
        if len(resp1.result) > 0:
            return {
                'data': {
                    'current_period': resp1.result[0],
                    'definition_inventory_valuation': resp2.result['definition_inventory_valuation'],
                    'company_current_data': request.user.company_current_data,
                    # 'is_project': resp3.result['cost_cfg'].get('cost_per_project')
                },
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ReportInventoryListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_INVENTORY_COST_LIST).get(data)
        return resp.auto_return(key_success='report_inventory_cost_list')


class ReportInventoryProductWarehouseViewAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_INVENTORY_COST_WH_DETAIL).get(data)
        return resp.auto_return(key_success='report_inventory_cost_wh_detail')


class GetQRCodeLotInfoAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )

        now_day = datetime.now()
        if data.get('goods_receipt_date') != 'null':
            receipt_day = datetime.strptime(data.get('goods_receipt_date'), '%Y-%m-%d')
            day_in_stock = str(now_day - receipt_day).split(', ')
            qr.add_data(
                f"- Product: [{data.get('product_code')}] - {data.get('product_title')}\n"
                f"  {(data.get('product_des')) if data.get('product_des') else ''}\n"
                f"- Lot number: {data.get('lot_number')}\n"
                
                f"- Goods receipt date: {data.get('goods_receipt_date')}\n"
                f"- Days in stock: {day_in_stock[0]}\n\n"
                f"* Latest updated: {str(now_day).split(' ')[0]}"
            )
        else:
            qr.add_data(
                f"- Product: [{data.get('product_code')}] - {data.get('product_title')}\n"
                f"  {(data.get('product_des')) if data.get('product_des') else ''}\n"
                f"- Lot number: {data.get('lot_number')}\n"

                f"- Goods receipt date: None\n"
                f"- Days in stock: None\n\n"
                f"* Latest updated: {str(now_day).split(' ')[0]}"
            )
        qr.make(fit=True)
        img = qr.make_image(back_color=(255, 255, 255), fill_color='#007D88')
        path = f"apps/sales/report/static/assets/sales/inventory_report/QR_lot_info/{data.get('product_id')}_{data.get('lot_number')}.png"
        img.save(path)
        return {'qr_path_lot': [{'path': path.replace('apps/sales/report', '')}]}, status.HTTP_200_OK


class GetQRCodeSerialInfoAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        now_day = datetime.now()
        if data.get('goods_receipt_date') != 'null':
            receipt_day = datetime.strptime(data.get('goods_receipt_date'), '%Y-%m-%d')
            day_in_stock = str(now_day - receipt_day).split(', ')
            qr.add_data(
                f"- Product: [{data.get('product_code')}] - {data.get('product_title')}\n"
                f"  {(data.get('product_des')) if data.get('product_des') else ''}\n"
                f"- Serial number: {data.get('serial_number')}\n"
                f"- Vendor serial number: {data.get('vendor_serial_number')}\n"

                f"- Goods receipt date: {data.get('goods_receipt_date')}\n"
                f"- Days in stock: {day_in_stock[0]}\n\n"
                f"* Latest updated: {str(now_day).split(' ')[0]}"
            )
        else:
            qr.add_data(
                f"- Product: [{data.get('product_code')}] - {data.get('product_title')}\n"
                f"  {(data.get('product_des')) if data.get('product_des') else ''}\n"
                f"- Serial number: {data.get('serial_number')}\n"
                f"- Vendor serial number: {data.get('vendor_serial_number')}\n"

                f"- Goods receipt date: None\n"
                f"- Days in stock: None\n\n"
                f"* Latest updated: {str(now_day).split(' ')[0]}"
            )
        qr.make(fit=True)
        img = qr.make_image(back_color=(255, 255, 255), fill_color='#007D88')
        path = f"apps/sales/report/static/assets/sales/inventory_report/QR_sn_info/{data.get('product_id')}_{data.get('serial_number')}.png"
        img.save(path)
        return {'qr_path_sn': [{'path': path.replace('apps/sales/report', '')}]}, status.HTTP_200_OK


# class ReportInventoryChatBotAPI(APIView):
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def get(self, request, *args, **kwargs):
#         params = request.query_params.dict()
#         contexts = params.get('contexts')
#         question = params.get('question')
#         vectorizer = TfidfVectorizer()
#         context_sentences = [sentence.strip() for sentence in contexts.split('.') if sentence]
#         context_vectors = vectorizer.fit_transform(context_sentences)
#         question_vector = vectorizer.transform([question])
#         similarities = cosine_similarity(question_vector, context_vectors).flatten()
#         best_context = context_sentences[similarities.argmax()]
#         return {'response': best_context}, status.HTTP_200_OK


# REPORT PIPELINE
class ReportPipelineList(View):

    @mask_view(
        auth_require=True,
        template='sales/report/report_pipeline.html',
        menu_active='menu_report_pipeline_list',
        breadcrumb='REPORT_PIPELINE_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'filter_quarter': FILTER_QUARTER, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK


class ReportPipelineListAPI(APIView):

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

    @mask_view(
        auth_require=True,
        template='sales/report/report_cashflow.html',
        menu_active='menu_report_cashflow_list',
        breadcrumb='REPORT_CASHFLOW_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'filter_quarter': FILTER_QUARTER, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK


class ReportCashflowListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_CASHFLOW_LIST).get(data)
        return resp.auto_return(key_success='report_cashflow_list')


# REPORT GENERAL
class ReportGeneralList(View):

    @mask_view(
        auth_require=True,
        template='sales/report/report_general.html',
        menu_active='menu_report_general_list',
        breadcrumb='REPORT_GENERAL_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'filter_quarter': FILTER_QUARTER, 'filter_month': FILTER_MONTH}, status.HTTP_200_OK


class ReportGeneralListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REPORT_GENERAL_LIST).get(data)
        return resp.auto_return(key_success='report_general_list')


# PO REPORT
class PurchaseOrderReportList(View):

    @mask_view(
        auth_require=True,
        template='sales/purchasing_report/po_report.html',
        menu_active='menu_po_report',
        breadcrumb='REPORT_PURCHASING_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {
                'data': {'current_period': resp1.result[0]},
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class PurchaseOrderReportListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PO_REPORT_LIST).get(data)
        return resp.auto_return(key_success='po_report_list')


# BUDGET REPORT

# PO REPORT
class BudgetReportList(View):

    @mask_view(
        auth_require=True,
        template='sales/budget_report/budget_report.html',
        menu_active='menu_budget_report',
        breadcrumb='BUDGET_REPORT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=f'{ApiURL.PERIODS_CONFIG_LIST}?get_current=True').get()
        if len(resp1.result) > 0:
            return {
                'data': {'current_period': resp1.result[0]},
            }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class BudgetReportCompanyListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_REPORT_COMPANY_LIST).get(data)
        return resp.auto_return(key_success='budget_report_company_list')


class BudgetReportGroupListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_REPORT_GROUP_LIST).get(data)
        return resp.auto_return(key_success='budget_report_group_list')


class PaymentListForBudgetReportAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_REPORT_PAYMENT_LIST).get(data)
        return resp.auto_return(key_success='budget_report_payment_list')
