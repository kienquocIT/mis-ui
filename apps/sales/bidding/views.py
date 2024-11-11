import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS

def create_bidding(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()

def update_contract(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()

# Create your views here.
class BiddingList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/bidding/bidding_list.html',
        menu_active='menu_bidding_list',
        breadcrumb='BIDDING_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK

class BiddingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BIDDING_LIST).get(data)
        return resp.auto_return(key_success='bidding_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_bidding(
            request=request,
            url=ApiURL.BIDDING_LIST,
            msg=SaleMsg.BIDDING_CREATE
        )

class BiddingCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/bidding/bidding_create.html',
        menu_active='menu_bidding_list',
        breadcrumb='BIDDING_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            "list_from_app": 'bidding.bidding.create',
            'input_mapping_properties': InputMappingProperties.BIDDING_DATA_MAP,
            'form_id': 'frm_bidding_create'
        }
        return ctx, status.HTTP_200_OK

class BiddingDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/bidding/bidding_detail.html',
        menu_active='menu_bidding_list',
        breadcrumb='BIDDING_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            'data': {'doc_id': pk},
            'input_mapping_properties': InputMappingProperties.BIDDING_DATA_MAP,
            'form_id': 'frm_bidding_create',
            'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class BiddingUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/bidding/bidding_update.html',
        menu_active='menu_bidding_list',
        breadcrumb='BIDDING_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            'data': {'doc_id': pk},
            "list_from_app": 'bidding.bidding.edit',
            'input_mapping_properties': InputMappingProperties.BIDDING_DATA_MAP,
            'form_id': 'frm_bidding_create',
            'employee_current': request.user.employee_current_data,
        }, status.HTTP_200_OK

class BiddingDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BIDDING_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_contract(
            request=request,
            url=ApiURL.BIDDING_DETAIL,
            pk=pk,
            msg=SaleMsg.BIDDING_UPDATE
        )

class BiddingResultAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_bidding(
            request=request,
            url=ApiURL.BIDDING_RESULT,
            msg=SaleMsg.BIDDING_UPDATE
        )

class AccountForBiddingListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        # if 'account_types_mapped__account_type_order' in filter:
        #     filter['account_types_mapped__account_type_order'] = int(filter['account_types_mapped__account_type_order'])
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ACCOUNT_FOR_BIDDING_LIST).get(data)
        return resp.auto_return(key_success='account_for_bidding_list')

class DocumentMasterDataBiddingListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        filter = request.query_params.dict()
        # if 'account_types_mapped__account_type_order' in filter:
        #     filter['account_types_mapped__account_type_order'] = int(filter['account_types_mapped__account_type_order'])
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.DOCUMENT_MASTERDATA_BIDDING_LIST).get(filter)
        return resp.auto_return(key_success='document_masterdata_bidding_list')