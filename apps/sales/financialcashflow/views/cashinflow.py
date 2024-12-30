from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class CashInflowList(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashinflow/cashinflow_list.html',
        menu_active='menu_cash_inflow',
        breadcrumb='CASH_INFLOW_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CashInflowCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashinflow/cashinflow_create.html',
        menu_active='',
        breadcrumb='CASH_INFLOW_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
        return {
            'app_id': '7ba35923-d8ff-4f6d-bf80-468a7190a63b',
            'list_from_app': 'financialcashflow.cashinflow.create',
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-create-cashinflow'
        }, status.HTTP_200_OK


class CashInflowDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashinflow/cashinflow_detail.html',
        menu_active='',
        breadcrumb='CASH_INFLOW_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
        return {
            'list_from_app': 'financialcashflow.cashinflow.create',
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-detail-cashinflow'
        }, status.HTTP_200_OK


class CashInflowUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashinflow/cashinflow_update.html',
        menu_active='',
        breadcrumb='CASH_INFLOW_UPDATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.CASHOUTFLOW_ADVANCE
        return {
            'app_id': '7ba35923-d8ff-4f6d-bf80-468a7190a63b',
            'list_from_app': 'financialcashflow.cashinflow.edit',
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-detail-cashinflow'
        }, status.HTTP_200_OK


class CashInflowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHINFLOW_LIST).get(data)
        return resp.auto_return(key_success='cash_inflow_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHINFLOW_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.CIF_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class CashInflowDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHINFLOW_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='cash_inflow_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_CASHINFLOW_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.CIF_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ARInvoiceListForCashInflowAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_LIST_FOR_CASHINFLOW).get(data)
        return resp.auto_return(key_success='ar_invoice_list')


class ARInvoiceListForReconAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_LIST_FOR_RECON).get(data)
        return resp.auto_return(key_success='ar_invoice_list')
