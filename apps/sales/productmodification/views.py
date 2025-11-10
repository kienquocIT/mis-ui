from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


class ProductModificationList(View):
    @mask_view(
        auth_require=True,
        template='productmodification/product_modification_list.html',
        breadcrumb='PRODUCT_MODIFICATION_LIST_PAGE',
        menu_active='id_menu_product_modification',
        icon_cls='fa-solid fa-boxes-stacked',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductModificationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_LIST).get(params)
        return resp.auto_return(key_success='product_modification_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PRODUCT_MODIFICATION_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class ProductModificationCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='productmodification/product_modification_create.html',
        breadcrumb='PRODUCT_MODIFICATION_CREATE_PAGE',
        menu_active='',
        icon_cls='fa-solid fa-boxes-stacked',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-create-product-modification',
        }, status.HTTP_200_OK


class ProductModificationDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='productmodification/product_modification_detail.html',
        breadcrumb='PRODUCT_MODIFICATION_DETAIL_PAGE',
        menu_active='',
        icon_cls='fa-solid fa-boxes-stacked',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductModificationUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='productmodification/product_modification_update.html',
        breadcrumb='PRODUCT_MODIFICATION_UPDATE_PAGE',
        menu_active='',
        icon_cls='fa-solid fa-boxes-stacked',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-detail-product-modification',
        }, status.HTTP_200_OK


class ProductModificationDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_modification_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.PRODUCT_MODIFICATION_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# related API
class ProductModifiedListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFIED_LIST).get(params)
        print(len(resp.result))
        return resp.auto_return(key_success='product_modified_list')


class ProductModifiedBeforeListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFIED_BEFORE_LIST).get(params)
        return resp.auto_return(key_success='product_modified_before_list')


class ProductComponentListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_COMPONENT_LIST).get(params)
        return resp.auto_return(key_success='product_component_list')


class LatestComponentListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LATEST_COMPONENT_LIST).get(params)
        return resp.auto_return(key_success='latest_component_list')


class WarehouseListByProductAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST_BY_PRODUCT).get(params)
        return resp.auto_return(key_success='warehouse_list_by_product')


class ProductLotListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LOT_LIST).get(params)
        return resp.auto_return(key_success='product_lot_list')


class ProductSerialListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_SERIAL_LIST).get(params)
        return resp.auto_return(key_success='product_serial_list')


class ComponentInsertedListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        # đều load sản phẩm nên dùng chung URL với product modified
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFIED_LIST).get(params)
        return resp.auto_return(key_success='component_inserted_list')


class ProductModificationDDListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFIED_DROPDOWN_LIST).get(params)
        return resp.auto_return(key_success='product_modification_dd_list')


class ProductModificationProductGRListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.PRODUCT_MODIFIED_PRODUCT_GR_LIST).get(data)
        return resp.auto_return(key_success='product_modification_product_gr')
