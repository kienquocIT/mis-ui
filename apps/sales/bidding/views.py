import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS


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

class BiddingCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/bidding/bidding_create.html',
        menu_active='menu_bidding_list',
        breadcrumb='BIDDING_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = { }
        return ctx, status.HTTP_200_OK

class AccountForBiddingListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        filter = request.query_params.dict()
        # if 'account_types_mapped__account_type_order' in filter:
        #     filter['account_types_mapped__account_type_order'] = int(filter['account_types_mapped__account_type_order'])
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.ACCOUNT_FOR_BIDDING_LIST).get(filter)
        return resp.auto_return(key_success='account_for_bidding_list')

class DocumentMasterDataBiddingListAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        filter = request.query_params.dict()
        # if 'account_types_mapped__account_type_order' in filter:
        #     filter['account_types_mapped__account_type_order'] = int(filter['account_types_mapped__account_type_order'])
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.DOCUMENT_MASTERDATA_BIDDING_LIST).get(filter)
        return resp.auto_return(key_success='document_masterdata_bidding_list')