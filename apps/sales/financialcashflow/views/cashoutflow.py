from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class CashOutflowList(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_list.html',
        menu_active='menu_cash_outflow',
        breadcrumb='CASH_OUTFLOW_LIST_PAGE',
        icon_cls='fas fa-share',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CashOutflowCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_create.html',
        menu_active='',
        breadcrumb='CASH_OUTFLOW_CREATE_PAGE',
        icon_cls='fas fa-share',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-create-cashoutflow',
            'app_id': 'c51857ef-513f-4dbf-babd-26d68950ad6e',
            'list_from_app': 'financialcashflow.cashoutflow.create',
        }, status.HTTP_200_OK


class CashOutflowDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_detail.html',
        menu_active='',
        breadcrumb='CASH_OUTFLOW_DETAIL_PAGE',
        icon_cls='fas fa-share',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {'app_id': 'c51857ef-513f-4dbf-babd-26d68950ad6e',}, status.HTTP_200_OK


class CashOutflowUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_update.html',
        menu_active='',
        breadcrumb='CASH_OUTFLOW_UPDATE_PAGE',
        icon_cls='fas fa-share',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        # input_mapping_properties = InputMappingProperties.INVENTORY_GOODS_RETURN
        return {
            'form_id': 'form-detail-cashoutflow',
            'app_id': 'c51857ef-513f-4dbf-babd-26d68950ad6e',
            'list_from_app': 'financialcashflow.cashoutflow.edit',
        }, status.HTTP_200_OK


class CashOutflowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHOUTFLOW_LIST).get(data)
        return resp.auto_return(key_success='cash_outflow_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHOUTFLOW_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.COF_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class CashOutflowDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHOUTFLOW_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='cash_outflow_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHOUTFLOW_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.COF_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# related
class POPaymentStageListForCOFAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PO_PAYMENT_STAGE_LIST_FOR_COF).get(data)
        return resp.auto_return(key_success='po_payment_stage_list')


class APInvoicePOPaymentStageListForCOFAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.AP_INVOICE_PO_PAYMENT_STAGE_LIST_FOR_COF).get(data)
        return resp.auto_return(key_success='ap_invoice_po_payment_stage_list')


class SaleOrderListForCOFAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SO_LIST_FOR_COF).get(data)
        return resp.auto_return(key_success='sale_order_list')


class SaleOrderExpenseListForCOFAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SO_EXPENSE_LIST_FOR_COF).get(data)
        return resp.auto_return(key_success='so_expense_list')


class LeaseOrderListForCOFAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LO_LIST_FOR_COF).get(data)
        return resp.auto_return(key_success='lease_order_list')


class LeaseOrderExpenseListForCOFAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LO_EXPENSE_LIST_FOR_COF).get(data)
        return resp.auto_return(key_success='lo_expense_list')
