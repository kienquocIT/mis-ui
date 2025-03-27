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
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CashOutflowCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_create.html',
        menu_active='',
        breadcrumb='CASH_OUTFLOW_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {
            'data': {},
        }, status.HTTP_200_OK


class CashOutflowDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_detail.html',
        menu_active='',
        breadcrumb='CASH_OUTFLOW_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class CashOutflowUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/financialcashflow/cashoutflow/cashoutflow_update.html',
        menu_active='',
        breadcrumb='CASH_OUTFLOW_UPDATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        # input_mapping_properties = InputMappingProperties.INVENTORY_GOODS_RETURN
        return {
            'data': {},
            # 'input_mapping_properties': input_mapping_properties,
            # 'form_id': 'frm_goods_return_update'
        }, status.HTTP_200_OK


class CashOutflowListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_LIST).get(data)
        return resp.auto_return(key_success='cash_outflow_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class CashOutflowDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='cash_outflow_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_RETURN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.GRT_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
