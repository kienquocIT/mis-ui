from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import KMSMsg, BaseMsg


class DocumentTypeConfigList(View):

    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/doc-type-list.html',
        menu_active='menu_document_type_config',
        breadcrumb='KMS_DOC_TYPE_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DocumentTypeConfigListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOC_APPROVAL_CONFIG_LIST).get(params)
        return resp.auto_return(key_success='document_type_list')


class DocumentTypeConfigCreate(View):

    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/doc-type-create.html',
        menu_active='menu_document_type_config',
        breadcrumb='KMS_DOC_TYPE_CREATE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DocumentTypeConfigCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOC_APPROVAL_CONFIG_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{KMSMsg.DOC_TYPE} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class DocumentTypeConfigDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/doc-type-detail.html',
        menu_active='menu_document_type_config',
        breadcrumb='KMS_DOC_TYPE_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK


class DocumentTypeConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOC_APPROVAL_CONFIG_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOC_APPROVAL_CONFIG_DETAIL.fill_key(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{KMSMsg.DOC_TYPE} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_DOC_APPROVAL_CONFIG_DETAIL.fill_key(pk)).delete()
        return resp.auto_return(status_success=status.HTTP_204_NO_CONTENT)


class DocumentTypeConfigEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/doc-type-edit.html',
        menu_active='menu_document_type_config',
        breadcrumb='KMS_DOC_TYPE_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK
