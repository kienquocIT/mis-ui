import json

from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS


def create_contract(request, url, msg):
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


class ContractApprovalList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/contract/contract_list.html',
        menu_active='menu_contract_approval_list',
        breadcrumb='CONTRACT_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class ContractApprovalCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/contract/contract_create.html',
        menu_active='menu_contract_approval_list',
        breadcrumb='CONTRACT_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'employee_current': request.user.employee_current_data,
            'input_mapping_properties': InputMappingProperties.CONTRACT_APPROVAL_DATA_MAP,
            'form_id': 'frm_contract_create',
        }
        return ctx, status.HTTP_200_OK


class ContractApprovalListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.CONTRACT_LIST).get(data)
        return resp.auto_return(key_success='contract_approval_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_contract(
            request=request,
            url=ApiURL.CONTRACT_LIST,
            msg=SaleMsg.CONTRACT_CREATE
        )


class ContractApprovalDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/contract/contract_detail.html',
        menu_active='menu_contract_approval_list',
        breadcrumb='CONTRACT_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'data': {'doc_id': pk},
               }, status.HTTP_200_OK


class ContractApprovalUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/contract/contract_update.html',
        breadcrumb='menu_contract_approval_list',
        menu_active='CONTRACT_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'data': {'doc_id': pk},
            'employee_current': request.user.employee_current_data,
            'input_mapping_properties': InputMappingProperties.CONTRACT_APPROVAL_DATA_MAP,
            'form_id': 'frm_contract_create',

        }
        return ctx, status.HTTP_200_OK


class ContractApprovalDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CONTRACT_DETAIL.push_id(pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return update_contract(
            request=request,
            url=ApiURL.CONTRACT_DETAIL,
            pk=pk,
            msg=SaleMsg.CONTRACT_UPDATE
        )
