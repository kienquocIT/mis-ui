from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class ReconList(View):
    @mask_view(
        auth_require=True,
        template='sales/reconciliation/reconciliation_list.html',
        menu_active='menu_reconciliation',
        breadcrumb='RECON_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReconCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/reconciliation/reconciliation_create.html',
        menu_active='',
        breadcrumb='RECON_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.RECON_DATA_MAP
        return {
            'app_id': 'b690b9ff-670a-474b-8ae2-2c17d7c30f40',
            'list_from_app': 'reconciliation.reconciliation.create',
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-create-recon'
        }, status.HTTP_200_OK


class ReconDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/reconciliation/reconciliation_detail.html',
        menu_active='',
        breadcrumb='RECON_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.RECON_DATA_MAP
        return {
            'list_from_app': 'reconciliation.reconciliation.create',
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-detail-recon'
        }, status.HTTP_200_OK


class ReconUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/reconciliation/reconciliation_update.html',
        menu_active='',
        breadcrumb='RECON_UPDATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.RECON_DATA_MAP
        return {
            'list_from_app': 'reconciliation.reconciliation.edit',
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'form-detail-recon'
        }, status.HTTP_200_OK


class ReconListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_RECON_LIST).get(data)
        return resp.auto_return(key_success='recon_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_RECON_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.CIF_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ReconDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_RECON_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='recon_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FINANCIAL_RECON_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.CIF_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

# related
class APInvoiceListForReconAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.AP_INVOICE_LIST_FOR_RECON).get(data)
        return resp.auto_return(key_success='ap_invoice_list')


class CashOutflowListForReconAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.COF_LIST_FOR_RECON).get(data)
        return resp.auto_return(key_success='cash_outflow_list')


class ARInvoiceListForReconAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.AR_INVOICE_LIST_FOR_RECON).get(data)
        return resp.auto_return(key_success='ar_invoice_list')


class CashInflowListForReconAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CIF_LIST_FOR_RECON).get(data)
        return resp.auto_return(key_success='cash_inflow_list')
