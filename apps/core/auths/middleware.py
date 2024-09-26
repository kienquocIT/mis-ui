from django.conf import settings
from django.contrib.auth.models import AnonymousUser
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
        self.process_request(request)

        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    @classmethod
    def process_request(cls, request):
        if request.user and request.user.is_authenticated and not isinstance(request.user, AnonymousUser):
            language = getattr(request.user, 'language', settings.LANGUAGE_CODE)
        else:
            language = header_language(request)
        translation.activate(language)

    # def process_exception(self, request, exception):
    #     ...
