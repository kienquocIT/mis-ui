from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties


class ProductListForProjectBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PRODUCT_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='product_list')


class LaborListForProjectBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.LABOR_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='labor_list')


class ProductMaterialListForProjectBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.MATERIAL_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='material_list')


class ProductToolListForProjectBOMAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, *arg, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.TOOL_LIST_FOR_BOM).get(params)
        return resp.auto_return(key_success='tool_list')


# BEGIN
class ProjectBOMList(View):
    @mask_view(
        auth_require=True,
        template='sales/projectproduction/projectbom/projectbom_list.html',
        breadcrumb='PROJECT_BOM_LIST_PAGE',
        menu_active='menu_project_bom_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectBOMCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/projectproduction/projectbom/projectbom_create.html',
        breadcrumb='PROJECT_BOM_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'list_from_app': 'production.bom.create',
        }, status.HTTP_200_OK


class ProjectBOMDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/projectproduction/projectbom/projectbom_detail.html',
        breadcrumb='PROJECT_BOM_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ProjectBOMUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/projectproduction/projectbom/projectbom_update.html',
        breadcrumb='PROJECT_BOM_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {
            'list_from_app': 'production.bom.edit',
        }, status.HTTP_200_OK


class ProjectBOMListAPI(APIView):
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


class ProjectBOMDetailAPI(APIView):
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
