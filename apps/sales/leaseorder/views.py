import json

from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
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
    "purchasing.purchaserequest": AppMsg.APP_PURCHASE_REQUEST,
    "purchasing.purchaseorder": AppMsg.APP_PURCHASE_ORDER,
    "inventory.goodsreceipt": AppMsg.APP_GOODS_RECEIPT,
    "delivery.orderdeliverysub": AppMsg.APP_DELIVERY,
    "inventory.goodsreturn": AppMsg.APP_GOODS_RETURN,
}


def create_sale_order(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update_sale_order(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


# class SaleOrderList(View):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         template='sales/saleorder/sale_order_list.html',
#         menu_active='menu_sale_order_list',
#         breadcrumb='SALE_ORDER_LIST_PAGE',
#     )
#     def get(self, request, *args, **kwargs):
#         return {'stt_sys': SYSTEM_STATUS, 'delivery_status': DELIVERY_STATUS}, status.HTTP_200_OK


class LeaseOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/leaseorder/lease_order_create.html',
        breadcrumb='SALE_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        result = {
            'employee_current': employee_current,
            'app_id': 'a870e392-9ad2-4fe2-9baa-298a38691cf2',
            'input_mapping_properties': InputMappingProperties.SALE_ORDER_SALE_ORDER,
            'form_id': 'frm_quotation_create',
            'list_from_app': 'saleorder.saleorder.create',
            'payment_term_stage': PAYMENT_TERM_STAGE,
            'payment_date_type': PAYMENT_DATE_TYPE,
        }
        return result, status.HTTP_200_OK


# class SaleOrderListAPI(APIView):
#
#     @classmethod
#     def convert_params(cls, params):
#         if 'delivery_call' in params and params.get('delivery_call'):
#             params['delivery_call'] = False
#         if 'is_approved' in params and params.get('is_approved'):
#             params['system_status'] = 3  # status finish
#             del params['is_approved']
#         return params
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def get(self, request, *args, **kwargs):
#         params = self.convert_params(request.query_params.dict())
#         resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST).get(params)
#         return resp.auto_return(key_success='sale_order_list')
#
#     @mask_view(
#         auth_require=True,
#         is_api=True
#     )
#     def post(self, request, *args, **kwargs):
#         return create_sale_order(
#             request=request,
#             url=ApiURL.SALE_ORDER_LIST,
#             msg=SaleMsg.SALE_ORDER_CREATE
#         )
#
#
# class SaleOrderDetail(View):
#     permission_classes = [IsAuthenticated]
#
#     @mask_view(
#         auth_require=True,
#         template='sales/saleorder/sale_order_detail.html',
#         menu_active='menu_sale_order_list',
#         breadcrumb='SALE_ORDER_DETAIL_PAGE',
#     )
#     def get(self, request, pk, *args, **kwargs):
#         return {
#                    'data': {'doc_id': pk},
#                    'employee_current': request.user.employee_current_data,
#                    'input_mapping_properties': InputMappingProperties.SALE_ORDER_SALE_ORDER,
#                    'form_id': 'frm_quotation_create',
#                    'payment_term_stage': PAYMENT_TERM_STAGE,
#                    'payment_date_type': PAYMENT_DATE_TYPE,
#                    'stt_sys': SYSTEM_STATUS,
#                    'dia_app': DIAGRAM_APP,
#                }, status.HTTP_200_OK
#
#
# class SaleOrderUpdate(View):
#     @mask_view(
#         auth_require=True,
#         template='sales/saleorder/sale_order_update.html',
#         breadcrumb='SALE_ORDER_UPDATE_PAGE',
#         menu_active='menu_sale_order_list',
#     )
#     def get(self, request, pk, *args, **kwargs):
#         input_mapping_properties = InputMappingProperties.SALE_ORDER_SALE_ORDER
#         return {
#                    'data': {'doc_id': pk},
#                    'input_mapping_properties': input_mapping_properties,
#                    'form_id': 'frm_quotation_create',
#                    'list_from_app': 'saleorder.saleorder.edit',
#                    'payment_term_stage': PAYMENT_TERM_STAGE,
#                    'payment_date_type': PAYMENT_DATE_TYPE,
#                }, status.HTTP_200_OK
#
#
# class SaleOrderDetailAPI(APIView):
#
#     @mask_view(
#         auth_require=True,
#         is_api=True,
#     )
#     def get(self, request, *args, pk, **kwargs):
#         resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_DETAIL.push_id(pk)).get()
#         return resp.auto_return()
#
#     @mask_view(
#         auth_require=True,
#         is_api=True
#     )
#     def put(self, request, *args, pk, **kwargs):
#         return update_sale_order(
#             request=request,
#             url=ApiURL.SALE_ORDER_DETAIL,
#             pk=pk,
#             msg=SaleMsg.SALE_ORDER_UPDATE
#         )
