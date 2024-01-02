import json

import requests

from django.conf import settings
from django.http import HttpResponse, StreamingHttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from requests.exceptions import ConnectionError, SSLError, Timeout


class MediaProxyView(APIView):
    proxy_host = settings.API_DOMAIN_SIMPLE
    source = ''
    DEFAULT_HTTP_ACCEPT = 'application/json'
    DEFAULT_HTTP_ACCEPT_LANGUAGE = settings.LANGUAGE_CODE
    DEFAULT_CONTENT_TYPE = 'text/plain'
    ACCEPT_MAPS = {
        'text/html': 'application/json',
    }
    return_raw = True
    TIMEOUT = None

    def get_proxy_host(self):
        return self.proxy_host

    def get_source_path(self):
        if self.source:
            return self.source % self.kwargs
        return None

    def get_request_url(self, request, path):
        host = self.get_proxy_host()
        if path:
            return '/'.join([host, path])
        return host

    def get_request_data(self, request):
        if 'application/json' in request.content_type:
            return json.dumps(request.data)

        return request.data

    def get_default_headers(self, request):
        return {
            'Accept': request.META.get('HTTP_ACCEPT', self.DEFAULT_HTTP_ACCEPT),
            'Accept-Language': request.META.get(
                'HTTP_ACCEPT_LANGUAGE', self.DEFAULT_HTTP_ACCEPT_LANGUAGE
            ),
            'Content-Type': request.META.get('CONTENT_TYPE', self.DEFAULT_CONTENT_TYPE),
        }

    def get_headers(self, request):
        # import re
        # regex = re.compile('^HTTP_')
        # request_headers = dict((regex.sub('', header), value) for (header, value) in request.META.items() if
        # header.startswith('HTTP_'))
        headers = self.get_default_headers(request)

        # Translate Accept HTTP field
        accept_maps = self.ACCEPT_MAPS
        for old, new in accept_maps.items():
            headers['Accept'] = headers['Accept'].replace(old, new)

        return headers

    def create_response_raw(self, response):
        return StreamingHttpResponse(
            streaming_content=response.iter_content(chunk_size=4096),
            content_type=response.headers.get('content-type')
        )

    def create_response(self, response):
        if self.return_raw:
            return self.create_response_raw(response)

        status = response.status_code
        if status >= 400:
            body = {
                'code': status,
                'error': response.reason,
            }
        else:
            return self.create_response_raw(response)
        return Response(body, status)

    def create_error_response(self, body, status):
        return Response(body, status)

    def proxy(self, request, path):
        url = self.get_request_url(request, path)
        data = self.get_request_data(request)
        headers = self.get_headers(request)

        try:
            response = requests.request(
                method=request.method,
                url=url,
                data=data,
                headers=headers,
                timeout=self.TIMEOUT,
            )
        except (ConnectionError, SSLError):
            status = requests.status_codes.codes.bad_gateway
            return self.create_error_response(
                {
                    'code': status,
                    'error': 'Bad gateway',
                }, status
            )
        except (Timeout):
            status = requests.status_codes.codes.gateway_timeout
            return self.create_error_response(
                {
                    'code': status,
                    'error': 'Gateway timed out',
                }, status
            )

        return self.create_response(response)

    def get(self, request, *args, path, **kwargs):
        return self.proxy(request, 'media/' + path)


def media_proxy(request, path):
    resolve_url = f'{settings.API_DOMAIN_SIMPLE}/media/{path}'
    response = requests.get(resolve_url, stream=True)
    return HttpResponse(response.raw)
