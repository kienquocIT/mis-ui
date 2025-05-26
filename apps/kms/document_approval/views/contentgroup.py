from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import KMSMsg, BaseMsg


class ContentGroupList(View):

    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/content-group-list.html',
        menu_active='menu_content_group_config',
        breadcrumb='KMS_CONTENT_GROUP_LIST',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContentGroupListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_CONTENT_GROUP_LIST).get(params)
        return resp.auto_return(key_success='content_group_list')


class ContentGroupCreate(View):

    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/content-group-create.html',
        menu_active='menu_content_group_config',
        breadcrumb='KMS_CONTENT_GROUP_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ContentGroupCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_CONTENT_GROUP_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{KMSMsg.CONTENT_GROUP} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ContentGroupDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/content-group-detail.html',
        menu_active='menu_content_group_config',
        breadcrumb='KMS_CONTENT_GROUP_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK


class ContentGroupDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_CONTENT_GROUP_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_CONTENT_GROUP_DETAIL.fill_key(pk=pk)).put(request.data)
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
        resp = ServerAPI(user=request.user, url=ApiURL.KMS_CONTENT_GROUP_DETAIL.fill_key(pk=pk)).delete()
        return resp.auto_return(status_success=status.HTTP_204_NO_CONTENT)


class ContentGroupEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='kms/document_approval/config/content-group-edit.html',
        menu_active='menu_content_group_config',
        breadcrumb='KMS_CONTENT_GROUP_UPDATE_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK
