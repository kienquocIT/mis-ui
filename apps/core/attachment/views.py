from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from requests_toolbelt import MultipartEncoder

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.apis import RespData


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
