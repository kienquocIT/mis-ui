from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL


class CashOutflowQuotationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CASHOUTFLOW_QUOTATION_LIST).get(data)
        return resp.auto_return(key_success='quotation_list')


class CashOutflowSaleOrderListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CASHOUTFLOW_SALE_ORDER_LIST).get(data)
        return resp.auto_return(key_success='sale_order_list')


class CashOutflowSupplierListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CASHOUTFLOW_SUPPLIER_LIST).get(data)
        return resp.auto_return(key_success='supplier_list')
