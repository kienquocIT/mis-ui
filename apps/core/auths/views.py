from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import logout

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.shared import ServerAPI, ApiURL, mask_view, AuthMsg, ServerMsg, TypeCheck
from apps.core.account.models import User

from .forms import AuthLoginForm


class AuthOAuth2Login(APIView):
    permission_classes = [AllowAny]

    @classmethod
    def get(cls, request):
        ctx = {'is_notify_key': False}
        if request.user and request.user.is_authenticated and isinstance(request.user, User):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp.state is True:
                ctx['user_data'] = {
                    'id': request.user.id,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'avatar': request.user.avatar_url,
                    'companies_data': request.user.companies_data,
                }
        # request.session.flush()
        # request.user = AnonymousUser
        return render(request, 'auths/login_OAuth2.html', ctx)

    @classmethod
    def post_callback_success(cls, result):
        return {
            'id': result['id'],
            'access_code': result['code'],
            'secret_token_regis': result['access_token_regis'],
        }

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        # {
        #   "company_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        #   "access_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        #   "user_agent": "string",
        #   "public_ip": "string"
        # }
        company_id = request.data.get('company_id', None)
        access_id = request.data.get('access_id', None)
        public_ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT')
        if company_id and TypeCheck.check_uuid(company_id) and access_id and TypeCheck.check_uuid(
                access_id
        ) and public_ip and user_agent:
            data = {
                "company_id": company_id,
                "access_id": access_id,
                "user_agent": user_agent,
                "public_ip": public_ip
            }
            url = ApiURL.API_FORWARD_ACCESS_TOKEN_MEDIA
            resp = ServerAPI(request=request, user=request.user, url=url).post(data=data)
            return resp.auto_return(callback_success=self.post_callback_success)
        return {}, status.HTTP_403_FORBIDDEN


class AuthLogin(APIView):
    permission_classes = [AllowAny]

    @classmethod
    def get(cls, request):
        if request.user and not isinstance(request.user, AnonymousUser):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp.state is True:
                return redirect(request.query_params.get('next', reverse('HomeView')))
        request.session.flush()
        request.user = AnonymousUser
        return render(
            request, 'auths/login.html', {
                'is_notify_key': False,
                'captcha_enabled': settings.GG_RECAPTCHA_ENABLED,
                'secret_key_gg': settings.GG_RECAPTCHA_CLIENT_KEY if settings.GG_RECAPTCHA_ENABLED else None,
                'ui_domain': settings.UI_DOMAIN
            }
        )

    @mask_view(
        auth_require=False,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        is_oauth2 = request.query_params.get('is_oauth2', False)
        if is_oauth2 == 'true' or is_oauth2 == '1':
            is_oauth2 = True

        frm = AuthLoginForm(data=request.data)
        frm.is_valid()
        resp = ServerAPI(request=request, user=None, url=ApiURL.login).post(frm.cleaned_data)
        match resp.state:
            case True:
                user = User.regis_with_api_result(resp.result)
                if user:
                    if not frm.cleaned_data.get('remember'):
                        request.session.set_expiry(0)
                    # call login to system with register session credential to request
                    login(request, user)
                    ctx = {
                        'detail': AuthMsg.login_success,
                        'user_data': {
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'avatar': user.avatar_url,
                            'companies_data': request.user.companies_data,
                        } if is_oauth2 is True else {}
                    }
                    return ctx, status.HTTP_200_OK
                return {'detail': AuthMsg.login_exc, 'data': resp.result}, status.HTTP_400_BAD_REQUEST
            case False:
                return resp.errors, status.HTTP_400_BAD_REQUEST
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_400_BAD_REQUEST


class AuthLogout(APIView):
    @classmethod
    def get(cls, request):
        logout(request)
        request.user = AnonymousUser
        return redirect(reverse('AuthLogin') + '?next=' + request.query_params.get('next', ''))


class TenantLoginChoice(APIView):
    permission_classes = [AllowAny]

    @mask_view(auth_require=False, is_api=True)
    def get(self, request):
        resp = ServerAPI(request=request, user=None, url=ApiURL.tenants).get()
        if resp.state:
            return Response({'result': resp.result}, status=200)
        return Response({'result': []}, status=200)


class SwitchCompanyCurrentView(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.SWITCH_COMPANY).put(request.data)
        return resp.auto_return()


class SpaceChangeView(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        space_code = request.data.get('space_code')
        if space_code:
            request.user.ui_space_selected = space_code
            request.user.save(update_fields=['ui_space_selected'])
            return {}, status.HTTP_200_OK
        return {'space_code': 'Space Code is required'}


class MyLanguageAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        user_obj = request.user
        if user_obj and not isinstance(user_obj, AnonymousUser) and hasattr(user_obj, 'id'):
            language = request.data.get('language', None)
            if language in dict(settings.LANGUAGE_CHOICE):
                resp = ServerAPI(request=request, user=request.user, url=ApiURL.LANGUAGE_CHANGE).put(
                    data={'language': language}
                )
                if resp.state:
                    user_obj.language = language
                    user_obj.save()
                return {}, status.HTTP_200_OK
            return {'language': 'Language not support!'}, status.HTTP_400_BAD_REQUEST
        return {}, status.HTTP_403_FORBIDDEN
