from django.conf import settings
from django.shortcuts import render
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from requests_toolbelt import MultipartEncoder

from apps.shared import mask_view, ServerAPI, ApiURL


class AttachmentUpload(APIView):
    parser_classes = [MultiPartParser]

    @mask_view(login_require=True, auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('file')
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


class FilesUnusedAPI(APIView):
    @mask_view(login_require=True, auth_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FILE_UNUSED).get(data=data)
        return resp.auto_return(key_success='file_list')
