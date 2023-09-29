import json

from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, ConditionFormset, SaleMsg, InputMappingProperties


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


class SaleOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_list.html',
        menu_active='menu_sale_order_list',
        breadcrumb='SALE_ORDER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class SaleOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_create.html',
        breadcrumb='SALE_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        data_copy_to = request.GET.get('data_copy_to', "")
        opportunity = request.GET.get('opportunity', "")
        result = {
            'data': {
                'employee_current': json.dumps(request.user.employee_current_data),
                'data_copy_to': data_copy_to,
                'opportunity': opportunity,
            }
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
        return create_sale_order(
            request=request,
            url=ApiURL.SALE_ORDER_LIST,
            msg=SaleMsg.SALE_ORDER_CREATE
        )


class SaleOrderListForCashOutflowAPI(APIView):

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
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST_FOR_CASH_OUTFLOW).get(params)
        return resp.auto_return(key_success='sale_order_list')


class SaleOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_detail.html',
        menu_active='menu_sale_order_list',
        breadcrumb='SALE_ORDER_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'data': {'doc_id': pk}}, status.HTTP_200_OK


class SaleOrderUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_update.html',
        breadcrumb='SALE_ORDER_UPDATE_PAGE',
        menu_active='menu_sale_order_list',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.SALE_ORDER_SALE_ORDER
        return {
                   'data': {'doc_id': pk},
                   'input_mapping_properties': input_mapping_properties, 'form_id': 'frm_quotation_create'
               }, status.HTTP_200_OK


class SaleOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_sale_order(
            request=request,
            url=ApiURL.SALE_ORDER_DETAIL,
            pk=pk,
            msg=SaleMsg.SALE_ORDER_UPDATE
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
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SALEORDER_CALL.fill_key(pk=pk)).post(data={})
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
        return create_sale_order(
            request=request,
            url=ApiURL.SALE_ORDER_INDICATOR_LIST,
            msg=SaleMsg.SALE_ORDER_INDICATOR_CREATE
        )


class SaleOrderIndicatorDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.QUOTATION_INDICATOR_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_sale_order(
            request=request,
            url=ApiURL.SALE_ORDER_INDICATOR_DETAIL,
            pk=pk,
            msg=SaleMsg.SALE_ORDER_INDICATOR_UPDATE
        )


class SaleOrderIndicatorRestoreAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_sale_order(
            request=request,
            url=ApiURL.SALE_ORDER_INDICATOR_RESTORE,
            pk=pk,
            msg=SaleMsg.SALE_ORDER_INDICATOR_RESTORE
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
