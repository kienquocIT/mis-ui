from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg


class ProductModificationBOMList(View):
    @mask_view(
        auth_require=True,
        template='productmodificationbom/product_modification_bom_list.html',
        breadcrumb='PRODUCT_MODIFICATION_BOM_LIST_PAGE',
        menu_active='id_menu_product_modification_bom',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductModificationBOMListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_BOM_LIST).get(params)
        return resp.auto_return(key_success='product_modification_bom_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_BOM_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.PRODUCT_MODIFICATION_BOM_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class ProductModificationBOMCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='productmodificationbom/product_modification_bom_create.html',
        breadcrumb='PRODUCT_MODIFICATION_BOM_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-create-product-modification-bom',
        }, status.HTTP_200_OK


class ProductModificationBOMDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='productmodificationbom/product_modification_bom_detail.html',
        breadcrumb='PRODUCT_MODIFICATION_BOM_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProductModificationBOMUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='productmodificationbom/product_modification_bom_update.html',
        breadcrumb='PRODUCT_MODIFICATION_BOM_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'form_id': 'form-detail-product-modification-bom',
        }, status.HTTP_200_OK


class ProductModificationBOMDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_BOM_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='product_modification_bom_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_MODIFICATION_BOM_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.PRODUCT_MODIFICATION_BOM_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


# related API
class PMBOMProductModifiedListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PMBOM_PRODUCT_MODIFIED_LIST).get(params)
        return resp.auto_return(key_success='product_modified_list')


class PMBOMProductDDListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        # đều load sản phẩm nên dùng chung URL với product modified
        resp = ServerAPI(user=request.user, url=ApiURL.PMBOM_PRODUCT_MODIFIED_LIST).get(params)
        return resp.auto_return(key_success='product_list')


class PMBOMProductModifiedBeforeListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PMBOM_PRODUCT_MODIFIED_BEFORE_LIST).get(params)
        return resp.auto_return(key_success='product_modified_before_list')


class PMBOMProductComponentListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PMBOM_PRODUCT_COMPONENT_LIST).get(params)
        return resp.auto_return(key_success='product_component_list')


class PMBOMLatestComponentListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PMBOM_LATEST_COMPONENT_LIST).get(params)
        return resp.auto_return(key_success='latest_component_list')
