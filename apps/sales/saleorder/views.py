import json

from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties, BaseView
from apps.shared.msg import SOMsg, AppMsg
from apps.shared.constant import SYSTEM_STATUS


DELIVERY_STATUS = (
    (0, SOMsg.DELIVERY_TYPE_NONE),
    (1, SOMsg.DELIVERY_TYPE_DELIVERING),
    (2, SOMsg.DELIVERY_TYPE_PART),
    (3, SOMsg.DELIVERY_TYPE_DELIVERED),
)

INVOICE_STATUS = (
    (0, SOMsg.INVOICE_STATUS_NONE),
    (1, SOMsg.INVOICE_STATUS_PART),
    (2, SOMsg.INVOICE_STATUS_DONE),
)

PAYMENT_TERM_STAGE = (
    (0, SOMsg.PAYMENT_STAGE_SO),
    (1, SOMsg.PAYMENT_STAGE_CONTRACT),
    (2, SOMsg.PAYMENT_STAGE_DELIVERY),
    (3, SOMsg.PAYMENT_STAGE_ACCEPTANCE),
    (4, SOMsg.PAYMENT_STAGE_INVOICE),
)

PAYMENT_DATE_TYPE = (
    (0, SOMsg.PAYMENT_DATE_TYPE_CONTRACT),
    (1, SOMsg.PAYMENT_DATE_TYPE_CONTRACT),
    (2, SOMsg.PAYMENT_DATE_TYPE_DELIVERY),
    (3, SOMsg.PAYMENT_DATE_TYPE_INVOICE),
    (4, SOMsg.PAYMENT_DATE_TYPE_ACCEPTANCE),
    (5, SOMsg.PAYMENT_DATE_TYPE_MONTH),
    (6, SOMsg.PAYMENT_DATE_TYPE_ORDER),
)

DIAGRAM_APP = {
    "quotation.quotation": AppMsg.APP_QUOTATION,
    "saleorder.saleorder": AppMsg.APP_SALE_ORDER,
    "purchasing.purchaserequest": AppMsg.APP_PURCHASE_REQUEST,
    "purchasing.purchaseorder": AppMsg.APP_PURCHASE_ORDER,
    "inventory.goodsreceipt": AppMsg.APP_GOODS_RECEIPT,
    "delivery.orderdeliverysub": AppMsg.APP_DELIVERY,
    "inventory.goodsreturn": AppMsg.APP_GOODS_RETURN,
}


class SaleOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_list.html',
        menu_active='menu_sale_order_list',
        breadcrumb='SALE_ORDER_LIST_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'stt_sys': SYSTEM_STATUS,
                   'delivery_status': DELIVERY_STATUS,
                   'invoice_status': INVOICE_STATUS,
               }, status.HTTP_200_OK


class SaleOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_create.html',
        breadcrumb='SALE_ORDER_CREATE_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
    )
    def get(self, request, *args, **kwargs):
        data_copy_to = request.GET.get('data_copy_to', "")
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        result = {
            'employee_current': employee_current,
            'app_id': 'a870e392-9ad2-4fe2-9baa-298a38691cf2',
            'data_copy_to': data_copy_to,
            'input_mapping_properties': InputMappingProperties.SALE_ORDER_SALE_ORDER,
            'form_id': 'frm_quotation_create',
            'list_from_app': 'saleorder.saleorder.create',
            'payment_term_stage': PAYMENT_TERM_STAGE,
            'payment_date_type': PAYMENT_DATE_TYPE,
        }
        return result, status.HTTP_200_OK


class SaleOrderListAPI(APIView):

    @classmethod
    def convert_params(cls, params):
        if 'delivery_call' in params and params.get('delivery_call'):
            params['delivery_call'] = False
        if 'is_approved' in params and params.get('is_approved'):
            params['system_status'] = 3  # status finish
            del params['is_approved']
        return params

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = self.convert_params(request.query_params.dict())
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST).get(params)
        return resp.auto_return(key_success='sale_order_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.SALE_ORDER_LIST,
        )


class SaleOrderDDListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_DROPDOWN_LIST).get(params)
        return resp.auto_return(key_success='sale_order_dd_list')


class SaleOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_detail.html',
        menu_active='menu_sale_order_list',
        breadcrumb='SALE_ORDER_DETAIL_PAGE',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
    )
    def get(self, request, pk, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        return {
                   'data': {'doc_id': pk},
                   'employee_current': employee_current,
                   'input_mapping_properties': InputMappingProperties.SALE_ORDER_SALE_ORDER,
                   'form_id': 'frm_quotation_create',
                   'payment_term_stage': PAYMENT_TERM_STAGE,
                   'payment_date_type': PAYMENT_DATE_TYPE,
                   'stt_sys': SYSTEM_STATUS,
                   'dia_app': DIAGRAM_APP,
               }, status.HTTP_200_OK


class SaleOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_update.html',
        breadcrumb='SALE_ORDER_UPDATE_PAGE',
        menu_active='menu_sale_order_list',
        icon_cls='fas fa-shopping-cart',
        icon_bg='bg-brown',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.SALE_ORDER_SALE_ORDER
        return {
                   'data': {'doc_id': pk},
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'frm_quotation_create',
                   'list_from_app': 'saleorder.saleorder.edit',
                   'payment_term_stage': PAYMENT_TERM_STAGE,
                   'payment_date_type': PAYMENT_DATE_TYPE,
                   'app_id': 'a870e392-9ad2-4fe2-9baa-298a38691cf2',
               }, status.HTTP_200_OK


class SaleOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.SALE_ORDER_DETAIL,
            pk=pk,
        )


class SaleOrderExpenseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_EXPENSE_LIST).get(data)
        return resp.auto_return(key_success='sale_order_expense_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SALEORDER_CALL.fill_key(pk=pk)).post(data={})
        return resp.auto_return()


class SaleOrderDetailDeliveryAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SALEORDER_CALL.fill_key(pk=pk)).post(data=request.data)
        return resp.auto_return()


# Config
class SaleOrderConfigDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/config/sale_order_config.html',
        menu_active='menu_sale_order_config',
        breadcrumb='SALE_ORDER_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class SaleOrderConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_CONFIG).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.SALE_ORDER_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# SALE ORDER INDICATOR
class SaleOrderIndicatorListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = {'application_code': 'saleorder'}
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_INDICATOR_LIST).get(data)
        return resp.auto_return(key_success='quotation_indicator_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.SALE_ORDER_INDICATOR_LIST,
        )


class SaleOrderIndicatorDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_INDICATOR_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.SALE_ORDER_INDICATOR_DETAIL,
            pk=pk,
        )


class SaleOrderIndicatorRestoreAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.SALE_ORDER_INDICATOR_RESTORE,
            pk=pk,
        )


class ProductListSaleOrderAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST_SALE_ORDER.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='so_product_list')


class SaleOrderPurchasingStaffListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST_FOR_PURCHASING_STAFF).get(params)
        return resp.auto_return(key_success='sale_order_list')


class SOProductWOListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.SALE_ORDER_PRODUCT_WO_LIST).get(data)
        return resp.auto_return(key_success='sale_order_product_wo')


class SORecurrenceListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.SALE_ORDER_RECURRENCE_LIST).get(data)
        return resp.auto_return(key_success='sale_order_recurrence')
