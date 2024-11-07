from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponseNotAllowed
from django.utils import translation


def header_language(request):
    if request:
        head_lang = request.headers.get('Accept-Language', '').lower()
        if head_lang:
            if ',' in head_lang:
                head_lang = head_lang.split(",")[0]

            if ';' in head_lang:
                head_lang = head_lang.split(";")

            if '-' in head_lang:
                head_lang = head_lang.split('-')[0]

            if head_lang in settings.LANGUAGE_CHOICE_CODE:
                return head_lang
    return settings.LANGUAGE_CODE


class CustomMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        if request.method not in ['GET', 'POST', 'PUT', 'DELETE']:
            return HttpResponseNotAllowed([])

        self.process_request(request)
        response = self.get_response(request)
        return response

    @classmethod
    def process_request(cls, request):
        if request.user and request.user.is_authenticated and not isinstance(request.user, AnonymousUser):
            language = getattr(request.user, 'language', settings.LANGUAGE_CODE)
        else:
            language = header_language(request)
        translation.activate(language)
