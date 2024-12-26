from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from .contract_template_config import HTML_LABOR, HTML_PROBATION
from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg.contract_template import ContractTemplateMsg
from ...shared.apis import RespData


class ContractTemplateList(View):
    @mask_view(
        auth_require=True,
        template='core/contract_template/list.html',
        menu_active='menu_contract_template',
        breadcrumb='CONTRACT_TEMPLATE_LIST_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContractTemplateListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='contract_template_list')


class ContractTemplateCreate(View):
    @mask_view(
        auth_require=True,
        template='core/contract_template/create.html',
        menu_active='menu_contract_template',
        breadcrumb='CONTRACT_TEMPLATE_CREATE_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContractTemplateCreateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = ContractTemplateMsg.CT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ContractTemplateDetail(View):
    @mask_view(
        auth_require=True,
        template='core/contract_template/detail.html',
        menu_active='menu_contract_template',
        breadcrumb='CONTRACT_TEMPLATE_DETAIL_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'pk': pk
               }, status.HTTP_200_OK


class ContractTemplateDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_DETAIL.fill_key(pk=pk)).delete()
        return resp.auto_return(status_success=status.HTTP_204_NO_CONTENT)


class ContractTemplateUpdate(View):
    @mask_view(
        auth_require=True,
        template='core/contract_template/update.html',
        menu_active='menu_contract_template',
        breadcrumb='CONTRACT_TEMPLATE_UPDATE_PAGE'
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'pk': pk
               }, status.HTTP_200_OK


class ContractTemplateUpdateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_TEMPLATE_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = ContractTemplateMsg.CT_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ContractTemplateConfigAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        result = [
            {
                'title': _('Labor contract'),
                'description': _('template labor contract'),
                'content': HTML_LABOR
            },
            {
                'title': _('Probation contract'),
                'description': _('template probation content'),
                'content': HTML_PROBATION
            }
        ]
        return RespData.resp_200(data={'templates': result})


class ContractRuntimeCreate(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.CORE_CONTRACT_RUNTIME).post(request.data)
        if resp.state:
            resp.result['message'] = ContractTemplateMsg.CT_RUNTIME_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
