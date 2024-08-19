from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties


class BORList(View):
    @mask_view(
        auth_require=True,
        template='sales/bor/bor_list.html',
        breadcrumb='BOR_LIST_PAGE',
        menu_active='menu_bor_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BORCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/bor/bor_create.html',
        breadcrumb='BOR_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
        # input_mapping_properties = InputMappingProperties.BOR
        # return {
        #     'input_mapping_properties': input_mapping_properties,
        #     'list_from_app': 'bor.bor.create',
        #     'form_id': 'form-create-bor'
        # }, status.HTTP_200_OK


class BORDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/bor/bor_detail.html',
        breadcrumb='BOR_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
        # input_mapping_properties = InputMappingProperties.BOR
        # return {
        #     'input_mapping_properties': input_mapping_properties,
        #     'list_from_app': 'bor.bor.create',
        #     'form_id': 'form-detail-bor'
        # }, status.HTTP_200_OK


class BORUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/bor/bor_update.html',
        breadcrumb='BOR_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
        # input_mapping_properties = InputMappingProperties.BOR
        # return {
        #     'input_mapping_properties': input_mapping_properties,
        #     'list_from_app': 'bor.bor.edit',
        #     'form_id': 'form-detail-bor'
        # }, status.HTTP_200_OK


class BORListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BOR_LIST).get(params)
        return resp.auto_return(key_success='bor_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BOR_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.BOR_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class BORDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BOR_DETAIL.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='bor_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.BOR_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.BOR_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
