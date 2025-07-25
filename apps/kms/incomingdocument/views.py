from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties, SECURITY_LV, SYSTEM_STATUS, SaleMsg
from apps.shared.msg import KMSMsg, BaseMsg


class IncomingDocumentCreate(View):
    @mask_view(
        auth_require=True,
        template='kms/incomingdocument/create.html',
        menu_active='menu_incoming_document',
        breadcrumb='INCOMING_DOCUMENT_CREATE_PAGE',
        icon_cls='fas fa-file-invoice-dollar',
        icon_bg='bg-violet',
    )
    def get(self, request, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        ctx = {
            'employee_current': employee_current,
            'lst_lv': SECURITY_LV,
        }
        return ctx, status.HTTP_200_OK


class IncomingDocumentList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/incomingdocument/list.html',
        menu_active='',
        breadcrumb='INCOMING_DOCUMENT_LIST'
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class IncomingDocumentListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INCOMING_DOCUMENT_LIST).get(params)
        return resp.auto_return(key_success='incoming_document_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INCOMING_DOCUMENT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = KMSMsg.INCOMING_DOC_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class IncomingDocumentDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/incomingdocument/detail.html',
        menu_active='menu_incoming_document',
        breadcrumb='INCOMING_DOCUMENT_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk, 'lst_lv': SECURITY_LV}, status.HTTP_200_OK


class IncomingDocumentDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INCOMING_DOCUMENT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.INCOMING_DOCUMENT_DETAIL.fill_key(pk=pk)
        ).put(request.data)
        if resp.state:
            resp.result['message'] = f'{KMSMsg.INCOMING_DOCUMENT} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class IncomingDocumentEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/incomingdocument/edit.html',
        menu_active='menu_incoming_document',
        breadcrumb='INCOMING_DOCUMENT_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.INCOMING_DOCUMENT_DATA_MAP
        return {
           'pk': pk,
           'data': {'doc_id': pk},
           'input_mapping_properties': input_mapping_properties,
           'form_id': 'frm_detail_incoming_document',
           'lst_lv': SECURITY_LV
        }, status.HTTP_200_OK

