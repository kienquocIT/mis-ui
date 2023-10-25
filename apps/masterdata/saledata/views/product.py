from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, PermCheck


class ProductMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/saledata_product_list.html',
        breadcrumb='PRODUCT_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_product',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductTypeListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_LIST).get(params)
        return resp.auto_return(key_success='product_type_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_LIST).post(request.data)
        return resp.auto_return()


class ProductTypeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_type')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_TYPE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='product_type')


class ProductCategoryListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_LIST).get(params)
        return resp.auto_return(key_success='product_category_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_LIST).post(request.data)
        return resp.auto_return()


class ProductCategoryDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_category')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_CATEGORY_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='product_category')


class UnitOfMeasureListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).get(params)
        return resp.auto_return(key_success='unit_of_measure')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE).post(request.data)
        return resp.auto_return()


class UnitOfMeasureDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='unit_of_measure')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='unit_of_measure')


class UnitOfMeasureGroupListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP).get(params)
        return resp.auto_return(key_success='unit_of_measure_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP).post(request.data)
        return resp.auto_return()


class UnitOfMeasureGroupDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='uom_group')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UNIT_OF_MEASURE_GROUP_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='uom_group')


class ProductList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_list.html',
        breadcrumb='PRODUCT_LIST_PAGE',
        menu_active='id_menu_product_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_create.html',
        breadcrumb='PRODUCT_CREATE_PAGE',
        menu_active='menu_product_list',
        perm_check=PermCheck(url=ApiURL.PRODUCT_LIST, method='post'),
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        resp1 = ServerAPI(url=ApiURL.CURRENCY_LIST, user=request.user).get()
        return {
                   'unit': resp0.result,
                   'currency_list': resp1.result,
        }, status.HTTP_200_OK


class ProductListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).get(params)
        return resp.auto_return(key_success='product_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST).post(request.data)
        return resp.auto_return()


class ProductDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_detail.html',
        breadcrumb='PRODUCT_DETAIL_PAGE',
        menu_active='menu_product_detail',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        resp1 = ServerAPI(url=ApiURL.CURRENCY_LIST, user=request.user).get()
        result = {
            'unit': resp0.result,
            'currency_list': resp1.result,
        }
        return result, status.HTTP_200_OK


class WarehouseGetProductsListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_PRODUCT_LIST).get(params)
        return resp.auto_return(key_success='warehouse_products_list')


class ProductUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/product/product_update.html',
        breadcrumb='PRODUCT_UPDATE_PAGE',
        menu_active='menu_product_update',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        resp1 = ServerAPI(url=ApiURL.CURRENCY_LIST, user=request.user).get()
        result = {
            'unit': resp0.result,
            'currency_list': resp1.result,
        }
        return result, status.HTTP_200_OK


class ProductDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()


# Product List use for Sale Apps
class ProductForSaleListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SALE_LIST).get(data)
        return resp.auto_return(key_success='product_sale_list')


class UnitOfMeasureOfGroupLaborListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.UOM_OF_GROUP_LABOR_LIST).get(params)
        return resp.auto_return(key_success='uom_of_group_labor')
