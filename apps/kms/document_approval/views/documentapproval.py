from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties, SYSTEM_STATUS
from apps.shared.constant import SECURITY_LV
from apps.shared.msg import KMSMsg, BaseMsg


class KMSDocumentApprovalList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/list.html',
        menu_active='menu_document_approval',
        breadcrumb='KMS_DOCUMENT_APPROVAL_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class KMSDocumentApprovalListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOCUMENT_APPROVAL_LIST).get(params)
        return resp.auto_return(key_success='kms_doc_approval_list')


class KMSDocumentApprovalCreate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/create.html',
        menu_active='menu_document_approval',
        breadcrumb='KMS_DOCUMENT_APPROVAL_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'lst_lv': SECURITY_LV
               }, status.HTTP_200_OK


class KMSDocumentApprovalCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOCUMENT_APPROVAL_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{KMSMsg.DOCUMENT_APPROVAL} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class KMSDocumentApprovalDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/detail.html',
        menu_active='menu_document_approval',
        breadcrumb='KMS_DOCUMENT_APPROVAL_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk, 'lst_lv': SECURITY_LV}, status.HTTP_200_OK


class KMSDocumentApprovalDetailAPI(APIView):

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOCUMENT_APPROVAL_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOCUMENT_APPROVAL_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{KMSMsg.DOCUMENT_APPROVAL} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class KMSDocumentApprovalEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/edit.html',
        menu_active='menu_document_approval',
        breadcrumb='KMS_DOCUMENT_APPROVAL_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.KMS_DOCUMENT_APPROVAL_DATA_MAP
        return {
                   'pk': pk,
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'frm_document_approval',
                   'lst_lv': SECURITY_LV
               }, status.HTTP_200_OK
