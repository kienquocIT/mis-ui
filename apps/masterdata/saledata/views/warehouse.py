from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

__all__ = [
    'WareHouseList', 'WareHouseListAPI', 'WareHouseDetailAPI',
    'WarehouseProductAPI', 'WareHouseListForInventoryAdjustmentAPI',
    'WareHouseCreate', 'WareHouseDetail', 'WareHouseUpdate'
]


class WareHouseList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/warehouse/list.html',
        breadcrumb='WAREHOUSE_LIST_PAGE',
        menu_active='menu_warehouse_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WareHouseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST).get(params)
        return resp.auto_return(key_success='warehouse_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST).post(request.data)
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class WareHouseDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='warehouse_detail')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='detail')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_DETAIL.fill_key(pk=pk)).delete()
        return resp.auto_return(key_success='result')


class WarehouseProductAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        url = ApiURL.WAREHOUSE_STOCK_PRODUCT.fill_key(product_id=params['product_id'], uom_id=params['uom_id'])
        resp = ServerAPI(user=request.user, url=url).get(params)
        return resp.auto_return(key_success='warehouse_stock')


class WareHouseListForInventoryAdjustmentAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST_FOR_INVENTORY_ADJUSTMENT).get(params)
        return resp.auto_return(key_success='warehouses_products_list')


class WareHouseCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/warehouse/create.html',
        breadcrumb='WAREHOUSE_CREATE_PAGE',
        menu_active='menu_warehouse_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WareHouseDetail(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/warehouse/detail.html',
        breadcrumb='WAREHOUSE_DETAIL_PAGE',
        menu_active='menu_warehouse_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WareHouseUpdate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/warehouse/update.html',
        breadcrumb='WAREHOUSE_UPDATE_PAGE',
        menu_active='menu_warehouse_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WarehouseGetProductsListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_PRODUCT_LIST).get(params)
        return resp.auto_return(key_success='warehouse_products_list')


class WarehouseLotListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LOT_LIST).get(data)
        return resp.auto_return(key_success='warehouse_lot_list')


class WarehouseSerialListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_SERIAL_LIST).get(data)
        return resp.auto_return(key_success='warehouse_serial_list')
