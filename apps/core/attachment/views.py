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
        resp = ServerAPI(ApiURL.MEDIA_ACCESS_TOKEN, user=request.user).get()
        if resp.state:
            access_token = resp.result['access_token']
            print('access_token: ', access_token)
            if access_token:
                uploaded_file = request.FILES.get('file')
                m = MultipartEncoder(fields={'file': (uploaded_file.name, uploaded_file, uploaded_file.content_type)})
                # call post to cloud API
                resp_media = ServerAPI(
                    url=ApiURL.MEDIA_UPLOAD_FILE,
                    api_domain=settings.MEDIA_DOMAIN,
                    cus_headers={
                        'content-type': m.content_type,
                        'Accept-Language': 'vi',
                        'Authorization': 'Bearer ' + access_token
                    },
                    is_secret_ui=True,
                ).post(data=m)
                if resp_media.state:
                    return {'detail': resp_media.result}, status.HTTP_200_OK
                return {'errors': resp_media.errors}, status.HTTP_400_BAD_REQUEST
            return {'detail': resp.result}, status.HTTP_200_OK
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
