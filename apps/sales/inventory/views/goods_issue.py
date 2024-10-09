from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties, SaleMsg


class GoodsIssueList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/list.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_LIST_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsIssueCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/create.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_CREATE_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsIssueDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/detail.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_DETAIL_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsIssueListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_LIST).get(data)
        return resp.auto_return(key_success='goods_issue_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_LIST).post(request.data)
        resp.result['message'] = SaleMsg.GOODS_ISSUE_CREATE
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class GoodsIssueDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOODS_ISSUE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='goods_issue_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_DETAIL.fill_key(pk=pk)).put(request.data)
        resp.result['message'] = SaleMsg.GOODS_ISSUE_UPDATE
        return resp.auto_return()


class GoodsIssueUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/update.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_UPDATE_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.INVENTORY_GOODS_ISSUE
        return {
            'input_mapping_properties': input_mapping_properties, 'form_id': 'frmUpdate'
        }, status.HTTP_200_OK


# related apiview
class InventoryAdjustmentListAPIForGIS(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_IA_LIST).get(data)
        return resp.auto_return(key_success='inventory_adjustment_list')


class InventoryAdjustmentDetailAPIForGIS(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_IA_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='inventory_adjustment_detail')


class ProductionOrderListAPIForGIS(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_PRODUCTION_ORDER_LIST).get(data)
        return resp.auto_return(key_success='production_order_list')


class ProductionOrderDetailAPIForGIS(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_PRODUCTION_ORDER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='production_order_detail')


class WorkOrderListAPIForGIS(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_WORK_ORDER_LIST).get(data)
        return resp.auto_return(key_success='work_order_list')


class WorkOrderDetailAPIForGIS(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_WORK_ORDER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='work_order_detail')


class ProductWarehouseListAPIForGIS(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_NONE_LIST).get(data)
        return resp.auto_return(key_success='warehouse_products_list')


class ProductWarehouseLotListAPIForGIS(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_LOT_LIST).get(data)
        return resp.auto_return(key_success='warehouse_lot_list')


class ProductWarehouseSerialListAPIForGIS(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GIS_SERIAL_LIST).get(data)
        return resp.auto_return(key_success='warehouse_serial_list')


class GoodsIssueProductListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_PRODUCT_LIST).get(data)
        return resp.auto_return(key_success='goods_issue_product')
