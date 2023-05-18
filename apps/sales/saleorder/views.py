import json

from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, ConditionFormset, SaleMsg


def create_update_sale_order(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    elif resp.status == 401:
        return {}, status.HTTP_401_UNAUTHORIZED
    return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST


class SaleOrderList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_list.html',
        menu_active='',
        breadcrumb='SALE_ORDER_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class SaleOrderCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_create.html',
        menu_active='',
        breadcrumb='SALE_ORDER_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        data_copy_to = request.GET.get('data_copy_to', "")
        return {
                   'data': {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'data_copy_to': data_copy_to
                   }
               }, status.HTTP_200_OK


class SaleOrderListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_LIST).get()
        if resp.state:
            return {'sale_order_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_update_sale_order(
            request=request,
            url=ApiURL.SALE_ORDER_LIST,
            msg=SaleMsg.SALE_ORDER_CREATE
        )


class SaleOrderDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/saleorder/sale_order_detail.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
               }, status.HTTP_200_OK


class SaleOrderDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        res = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_DETAIL.push_id(pk)).get()
        if res.state:
            return res.result, status.HTTP_200_OK
        elif res.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': res.errors}, status.HTTP_400_BAD_REQUEST


class SaleOrderExpenseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SALE_ORDER_EXPENSE_LIST).get(data)
        if resp.state:
            return {'sale_order_expense_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST
