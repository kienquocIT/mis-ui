from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties


class ProductListForOpportunityBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='product_list')


class LaborListForOpportunityBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LABOR_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='labor_list')


class ProductMaterialListForOpportunityBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.MATERIAL_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='material_list')


class ProductToolListForOpportunityBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.TOOL_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='tool_list')


# BEGIN
class OpportunityBOMList(View):
    @mask_view(
        auth_require=True,
        template='sales/production/opportunitybom/oppbom_list.html',
        breadcrumb='OPP_BOM_LIST_PAGE',
        menu_active='menu_project_bom_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityBOMCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/opportunitybom/oppbom_create.html',
        breadcrumb='OPP_BOM_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'list_from_app': 'production.bom.create',
        }, status.HTTP_200_OK


class OpportunityBOMDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/production/opportunitybom/oppbom_detail.html',
        breadcrumb='OPP_BOM_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OpportunityBOMUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/production/opportunitybom/oppbom_update.html',
        breadcrumb='OPP_BOM_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'list_from_app': 'production.bom.edit',
        }, status.HTTP_200_OK


class OpportunityBOMListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BOM_LIST).get(params)
        return resp.auto_return(key_success='bom_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BOM_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.BOM_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class OpportunityBOMDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BOM_DETAIL.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='bom_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.BOM_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.BOM_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
