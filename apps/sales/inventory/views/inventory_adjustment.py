from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties


class InventoryAdjustmentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/inventory_adjustment/inventory_adjustment_list.html',
        menu_active='menu_inventory_activities',
        breadcrumb='INVENTORY_ADJUSTMENT_LIST_PAGE',
        icon_cls='fas bi bi-sliders',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class InventoryAdjustmentListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_LIST).get()
        return resp.auto_return(key_success='inventory_adjustment_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.IA_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class InventoryAdjustmentCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/inventory_adjustment/inventory_adjustment_create.html',
        menu_active='menu_inventory_activities',
        breadcrumb='INVENTORY_ADJUSTMENT_CREATE_PAGE',
        icon_cls='fas bi bi-sliders',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.COMPANY_CONFIG).get()
        return {
            'data': {
                'definition_inventory_valuation': resp1.result['definition_inventory_valuation']
            },
        }, status.HTTP_200_OK


class InventoryAdjustmentDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/inventory_adjustment/inventory_adjustment_detail.html',
        breadcrumb='INVENTORY_ADJUSTMENT_DETAIL_PAGE',
        menu_active='menu_inventory_activities',
        icon_cls='fas bi bi-sliders',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_PRODUCT_LIST).get()
        return {
                   'warehouses_products_list': resp1.result
               }, status.HTTP_200_OK


class InventoryAdjustmentUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/inventory_adjustment/inventory_adjustment_update.html',
        breadcrumb='INVENTORY_ADJUSTMENT_UPDATE_PAGE',
        menu_active='menu_inventory_activities',
        icon_cls='fas bi bi-sliders',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        resp1 = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_PRODUCT_LIST).get()
        return {
            'warehouses_products_list': resp1.result
        }, status.HTTP_200_OK


class InventoryAdjustmentDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_DETAIL.fill_key(pk=pk)).get(data)
        return resp.auto_return(key_success='inventory_adjustment_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.IA_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# Inventory adjustment product use for GR
class InventoryAdjustmentProductGRListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_PRODUCT_GR_LIST).get(data)
        return resp.auto_return(key_success='inventory_adjustment_product_gr')


class InventoryAdjustmentProductListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, ia_id, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_PRODUCT_LIST.fill_key(ia_id=ia_id)).get()
        return resp.auto_return(key_success='ia_product_list')


class InventoryAdjustmentDDListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_ADJUSTMENT_DROPDOWN_LIST).get(params)
        return resp.auto_return(key_success='inventory_adjustment_dd_list')
