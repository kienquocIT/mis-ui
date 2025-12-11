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
    "leaseorder.leaseorder": AppMsg.APP_LEASE_ORDER,
    "purchasing.purchaserequest": AppMsg.APP_PURCHASE_REQUEST,
    "purchasing.purchaseorder": AppMsg.APP_PURCHASE_ORDER,
    "inventory.goodsreceipt": AppMsg.APP_GOODS_RECEIPT,
    "delivery.orderdeliverysub": AppMsg.APP_DELIVERY,
    "inventory.goodsreturn": AppMsg.APP_GOODS_RETURN,
}


class LeaseOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/leaseorder/lease_order_list.html',
        menu_active='menu_lease_order_list',
        breadcrumb='LEASE_ORDER_LIST_PAGE',
        icon_cls='fas fa-handshake',
        icon_bg='bg-green',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS, 'delivery_status': DELIVERY_STATUS}, status.HTTP_200_OK


class LeaseOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/leaseorder/lease_order_create.html',
        menu_active='menu_lease_order_list',
        breadcrumb='LEASE_ORDER_CREATE_PAGE',
        icon_cls='fas fa-handshake',
        icon_bg='bg-green',
    )
    def get(self, request, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        result = {
            'employee_current': employee_current,
            'app_id': '010404b3-bb91-4b24-9538-075f5f00ef14',
            'input_mapping_properties': InputMappingProperties.LEASE_ORDER_LEASE_ORDER,
            'form_id': 'frm_lease_create',
            'list_from_app': 'leaseorder.leaseorder.create',
            'payment_term_stage': PAYMENT_TERM_STAGE,
            'payment_date_type': PAYMENT_DATE_TYPE,
        }
        return result, status.HTTP_200_OK


class LeaseOrderListAPI(APIView):

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
        resp = ServerAPI(user=request.user, url=ApiURL.LEASE_ORDER_LIST).get(params)
        return resp.auto_return(key_success='lease_order_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.LEASE_ORDER_LIST,
        )


class LeaseOrderDDListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LEASE_ORDER_DROPDOWN_LIST).get(params)
        return resp.auto_return(key_success='lease_order_dd_list')


class LeaseOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/leaseorder/lease_order_detail.html',
        menu_active='menu_lease_order_list',
        breadcrumb='LEASE_ORDER_DETAIL_PAGE',
        icon_cls='fas fa-handshake',
        icon_bg='bg-green',
    )
    def get(self, request, pk, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        return {
                   'data': {'doc_id': pk},
                   'employee_current': employee_current,
                   'input_mapping_properties': InputMappingProperties.LEASE_ORDER_LEASE_ORDER,
                   'form_id': 'frm_lease_create',
                   'payment_term_stage': PAYMENT_TERM_STAGE,
                   'payment_date_type': PAYMENT_DATE_TYPE,
                   'stt_sys': SYSTEM_STATUS,
                   'dia_app': DIAGRAM_APP,
               }, status.HTTP_200_OK


class LeaseOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/leaseorder/lease_order_update.html',
        breadcrumb='LEASE_ORDER_UPDATE_PAGE',
        menu_active='menu_lease_order_list',
        icon_cls='fas fa-handshake',
        icon_bg='bg-green',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
                   'input_mapping_properties': InputMappingProperties.LEASE_ORDER_LEASE_ORDER,
                   'form_id': 'frm_lease_create',
                   'list_from_app': 'leaseorder.leaseorder.edit',
                   'payment_term_stage': PAYMENT_TERM_STAGE,
                   'payment_date_type': PAYMENT_DATE_TYPE,
                   'app_id': '010404b3-bb91-4b24-9538-075f5f00ef14',
               }, status.HTTP_200_OK


class LeaseOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEASE_ORDER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.LEASE_ORDER_DETAIL,
            pk=pk,
        )


# Config
class LeaseOrderConfigDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/leaseorder/lease_order_config.html',
        menu_active='menu_lease_order_config',
        breadcrumb='LEASE_ORDER_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class LeaseOrderConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEASE_ORDER_CONFIG).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.LEASE_ORDER_CONFIG).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.LEASE_ORDER_CONFIG_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class LeaseOrderDetailDeliveryAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LEASEORDER_CALL.fill_key(pk=pk)).post(data=request.data)
        return resp.auto_return()


class LORecurrenceListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.LEASE_ORDER_RECURRENCE_LIST).get(data)
        return resp.auto_return(key_success='lease_order_recurrence')


class LeaseOrderAssetList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/leaseorder/asset_status_lease_list.html',
        menu_active='menu_lease_asset_list',
        breadcrumb='LEASE_ASSET_LIST_PAGE',
        icon_cls='fa-solid fa-screwdriver-wrench',
        icon_bg='bg-gold',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
