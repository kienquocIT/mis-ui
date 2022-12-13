from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.utils import translation


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
        language = settings.LANGUAGE_CODE
        if request.user and not isinstance(request.user, AnonymousUser):
            language = getattr(request.user, 'language', settings.LANGUAGE_CODE)
        else:
            language_accept = request.headers.get('Accept-Language', settings.LANGUAGE_CODE)
            if language_accept and isinstance(language_accept, str):
                try:
                    language = language_accept.split(";")[0].split(',')[-1]
                except Exception as err:
                    print(err)
        translation.activate(language)

    # def process_exception(self, request, exception):
    #     ...
