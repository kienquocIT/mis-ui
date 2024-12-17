from django.shortcuts import render
from django.views import View
from apps.shared import ServerAPI, mask_view, SYSTEM_STATUS, ApiURL, SaleMsg, InputMappingProperties
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

def create(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()

def update(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()

class ConsultingList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/consulting/consulting_list.html',
        menu_active='menu_consulting_list',
        breadcrumb='CONSULTING_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK

class ConsultingCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/consulting/consulting_create.html',
        menu_active='menu_consulting_list',
        breadcrumb='CONSULTING_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            "list_from_app": 'consulting.consulting.create',
            'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_consulting_create',
            'app_id': '3a369ba582a04c4da4473794b67d1d02'
        }
        return ctx, status.HTTP_200_OK

class ConsultingDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/consulting/consulting_detail.html',
        menu_active='menu_consulting_list',
        breadcrumb='CONSULTING_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_consulting_create',
            'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class ConsultingUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/consulting/consulting_update.html',
        menu_active='menu_consulting_list',
        breadcrumb='CONSULTING_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            'data': {'doc_id': pk},
            'list_from_app': 'consulting.consulting.edit',
            'input_mapping_properties': InputMappingProperties.CONSULTING_DATA_MAP,
            'form_id': 'form_consulting_create',
            'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class ConsultingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CONSULTING_LIST).get(data)
        return resp.auto_return(key_success='consulting_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.CONSULTING_LIST,
            msg='Create consulting document successfully'
        )

class ConsultingDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONSULTING_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update(
            request=request,
            url=ApiURL.CONSULTING_DETAIL,
            pk=pk,
            msg='Update consulting document successfully'
        )

class ConsultingAccountListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.CONSULTING_ACCOUNT_LIST).get(data)
        return resp.auto_return(key_success='consulting_account_list')

class ConsultingProductCategoryListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.CONSULTING_PRODUCT_CATEGORY_LIST).get(data)
        return resp.auto_return(key_success='consulting_product_category_list')

class ConsultingDocumentMasterDataListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        filter = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.CONSULTING_MASTERDATA_DOC_LIST).get(filter)
        return resp.auto_return(key_success='consulting_document_masterdata_list')
