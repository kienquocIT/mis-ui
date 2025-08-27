from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class ShipmentMasterDataList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/shipment.html',
        breadcrumb='SHIPMENT_MASTER_DATA_LIST_PAGE',
        menu_active='menu_master_data_shipment',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContainerMasterDataListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CONTAINER_LIST).get(params)
        return resp.auto_return(key_success="container_list")

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTAINER_LIST).post(request.data)
        return resp.auto_return()


class ContainerMasterDataDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTAINER_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='container_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTAINER_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='container_detail')


class PackageMasterDataListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.PACKAGE_LIST).get(params)
        return resp.auto_return(key_success="package_list")

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PACKAGE_LIST).post(request.data)
        return resp.auto_return()


class PackageMasterDataDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.PACKAGE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='package_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.PACKAGE_DETAIL.fill_key(pk=pk)).put(data)
        return resp.auto_return()
