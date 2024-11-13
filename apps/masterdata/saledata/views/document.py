from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

class DocumentTypeMasterDataList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/saledata_document.html',
        breadcrumb='DOCUMENT_MASTER_DATA_LIST_PAGE',
        menu_active='id_menu_master_data_document',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DocumentTypeMasterDataListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DOCUMENT_TYPE_LIST).get(params)
        return resp.auto_return(key_success='document_type_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DOCUMENT_TYPE_LIST).post(request.data)
        return resp.auto_return(key_success='document_type_list')

class DocumentTypeMasterDataDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DOCUMENT_TYPE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='document_type')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DOCUMENT_TYPE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='document_type')
