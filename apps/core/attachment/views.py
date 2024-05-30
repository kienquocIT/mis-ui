from django.views import View
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from requests_toolbelt import MultipartEncoder

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.apis import RespData
from apps.shared.msg import CoreMsg


class AttachmentUpload(APIView):
    parser_classes = [MultiPartParser]

    @mask_view(login_require=True, auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('file')
        if uploaded_file:
            m = MultipartEncoder(
                fields={
                    'file': (uploaded_file.name, uploaded_file, uploaded_file.content_type),
                    'remarks': request.data.get('remarks', ''),
                }
            )
            resp = ServerAPI(
                request=request, user=request.user, url=ApiURL.FILE_UPLOAD,
                cus_headers={
                    'content-type': m.content_type,
                }
            ).post(data=m)
            return resp.auto_return(key_success='file_detail')
        return RespData.resp_400(errors_data={'file': 'Not found'})


class FilesUnusedAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FILE_UNUSED).get(data=data)
        return resp.auto_return(key_success='file_list')


class ImageWebBuilderUpload(APIView):
    parser_classes = [MultiPartParser]

    @mask_view(login_require=True, auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('files[]')
        if uploaded_file:
            if uploaded_file.content_type.startswith('image/'):
                m = MultipartEncoder(
                    fields={
                        'file': (uploaded_file.name, uploaded_file, uploaded_file.content_type),
                    }
                )
                resp = ServerAPI(
                    request=request, user=request.user, url=ApiURL.FILE_UPLOAD_WEB_BUILDER,
                    cus_headers={
                        'content-type': m.content_type,
                    }
                ).post(data=m)
                return resp.auto_return(key_success='file_detail')
        return {}, 400


class ImageWebBuilderList(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FILE_LIST_WEB_BUILDER).get()
        return resp.auto_return(key_success='file_list')


class FolderList(View):

    @mask_view(
        auth_require=True,
        template='core/attachment/folder_list.html',
        menu_active='menu_folder_list',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


# BEGIN FOLDER
def create_common(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class FolderListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FOLDER_LIST).get(data)
        return resp.auto_return(key_success='folder_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_common(
            request=request,
            url=ApiURL.FOLDER_LIST,
            msg=CoreMsg.FOLDER_CREATE
        )


class FolderFileListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FOLDER_FILE_LIST).get(data)
        return resp.auto_return(key_success='folder_file_list')
