import re

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, TypeCheck
from apps.shared.apis import RespData


def parse_user_agent(user_agent_string):
    os_patterns = [
        (r'Windows NT 10.0', 'Windows 10'),
        (r'Windows NT 6.3', 'Windows 8.1'),
        (r'Windows NT 6.2', 'Windows 8'),
        (r'Windows NT 6.1', 'Windows 7'),
        (r'Mac OS X (\d+[\._]\d+)', 'macOS'),
        (r'Android (\d+[\.\d+]*)', 'Android'),
        (r'iPhone OS (\d+_\d+)', 'iOS'),
        (r'Linux', 'Linux'),
    ]

    browser_patterns = [
        (r'Chrome/(\d+[\.\d+]*)', 'Chrome'),
        (r'Firefox/(\d+[\.\d+]*)', 'Firefox'),
        (r'Safari/(\d+[\.\d+]*)', 'Safari'),
        (r'Edge/(\d+[\.\d+]*)', 'Edge'),
        (r'MSIE (\d+[\.\d+]*)', 'Internet Explorer'),
        (r'Trident/(\d+[\.\d+]*)', 'Internet Explorer'),
    ]

    os = 'Unknown OS'
    os_version = ''
    browser = 'Unknown Browser'
    browser_version = ''

    for pattern, name in os_patterns:
        match = re.search(pattern, user_agent_string)
        if match:
            os = name
            if match.groups():
                os_version = match.group(1).replace('_', '.')
            break

    for pattern, name in browser_patterns:
        match = re.search(pattern, user_agent_string)
        if match:
            browser = name
            browser_version = match.group(1)
            break

    if 'Mobi' in user_agent_string:
        device = 'Mobile'
    elif 'Tablet' in user_agent_string:
        device = 'Tablet'
    else:
        device = 'Desktop'

    return {
        'os': os,
        'os_version': os_version,
        'browser': browser,
        'browser_version': browser_version,
        'device': device
    }


class FirebaseView(View):
    @mask_view(login_require=True, is_api=False, template='firebase/index.html')
    def get(self, request, *args, **kwargs):
        return [{
            'key_pair': "BAvQuI-bm-FOOrJnUo2pGlkEmZrSluNbixHRALUG8ppFFoKwPziqqyPtrlmzZ3fWGPhLP2bIzmc6_uqyo_7TvNQ",
        }, status.HTTP_200_OK]


class FirebaseAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        user_agent_string = request.META.get('HTTP_USER_AGENT', '')
        device_info = parse_user_agent(user_agent_string)

        url = 'firebase/control'
        resp = ServerAPI(request=request, user=request.user, url=url).post(
            data={
                **request.data,
                'device_info': device_info,
            }
        )
        return resp.auto_return(key_success='firebase')
