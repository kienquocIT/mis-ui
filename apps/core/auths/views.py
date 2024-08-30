from uuid import uuid4

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import logout
from django.views import View

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

import jwt

from apps.shared import ServerAPI, ApiURL, mask_view, AuthMsg, TypeCheck
from apps.core.account.models import User

from .forms import AuthLoginForm, ForgotPasswordForm, ForgotPasswordValidOTPForm, ForgotPasswordResendOTP
from apps.shared.csrf import CSRFCheckSessionAuthentication, APIAllowAny
from apps.shared.decorators import OutLayoutRender, session_flush, MyJWTClient


def check_home_domain(request):
    meta_hosts = request.META['HTTP_HOST']
    if meta_hosts and f'{settings.UI_DOMAIN_SUB_HOME}.{settings.UI_DOMAIN}' in meta_hosts:
        return True
    return False


class AuthLoginSelectTenant(APIView):
    permission_classes = [AllowAny]

    @classmethod
    def get(cls, request):
        if request.user and not isinstance(request.user, AnonymousUser):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp.state is True:
                return redirect(request.query_params.get('next', reverse('HomeView')))
        session_flush()
        return render(
            request,
            'auths/select_tenant.html' if settings.UI_ALLOW_SHOW_SELECT_TENANT else 'auths/select_tenant_deny.html',
            {
                'is_notify_key': False,
                'captcha_enabled': settings.GG_RECAPTCHA_ENABLED,
                'secret_key_gg': settings.GG_RECAPTCHA_CLIENT_KEY if settings.GG_RECAPTCHA_ENABLED else None,
                'allow_auto_tenant': settings.UI_ALLOW_AUTO_TENANT,
                'ui_domain': settings.UI_DOMAIN,
            }
        )


class AuthLogin(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user and not isinstance(request.user, AnonymousUser):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp.state is True:
                return redirect(request.query_params.get('next', reverse('HomeView')))
        session_flush(request=request)
        if check_home_domain(request) is True:
            return redirect(reverse('AuthLoginSelectTenant'))
        return render(
            request, 'auths/login.html', {
                'is_notify_key': False,
                'captcha_enabled': settings.GG_RECAPTCHA_ENABLED,
                'secret_key_gg': settings.GG_RECAPTCHA_CLIENT_KEY if settings.GG_RECAPTCHA_ENABLED else None,
                'allow_auto_tenant': settings.UI_ALLOW_AUTO_TENANT,
                'ui_domain': settings.UI_DOMAIN,
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
        if resp.state is True:
            user = User.regis_with_api_result(resp.result)
            if user:
                if not frm.cleaned_data.get('remember'):
                    request.session.set_expiry(0)
                # random DEVICE_ID
                request.session.update({
                    ServerAPI.KEY_SESSION_DEVICE_ID: uuid4().hex
                })
                # call login to system with register session credential to request
                login(request, user)

                # context
                ctx = {
                    'detail': AuthMsg.login_success,
                    'user_data': {
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'avatar': user.avatar_url,
                        'companies_data': request.user.companies_data,
                    } if is_oauth2 is True else {}
                }

                #
                token = jwt.decode(user.access_token, options={"verify_signature": False})
                is_2fa_verified = token.get(settings.JWT_KEY_2FA_VERIFIED, False)
                is_2fa_enabled = token.get(settings.JWT_KEY_2FA_ENABLED, False)
                if is_2fa_enabled is True and is_2fa_verified is False:
                    ctx['redirect_to'] = reverse('TwoFAVerifyView')

                return ctx, status.HTTP_200_OK
            return {'detail': AuthMsg.login_exc, 'data': resp.result}, status.HTTP_400_BAD_REQUEST
        return resp.errors, status.HTTP_400_BAD_REQUEST


class AuthLogout(View):
    authentication_classes = [AllowAny]

    @mask_view(
        login_require=False,
        auth_require=False,
        template='auths/logout.html',
    )
    def get(self, request, *args, **kwargs):
        if request.user and request.user.is_authenticated and not isinstance(request.user, AnonymousUser):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.logout, has_refresh_token=True).delete()
            if resp.state is False:
                pass
                # return resp.errors, status.HTTP_200_OK
        try:
            session_flush(request=request)
            logout(request)
        except Exception:
            pass
        return redirect(reverse('AuthLogin') + '?next=' + request.GET.get('next', '/'))


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


class ForgotPasswordView(View):
    authentication_classes = [AllowAny]

    @mask_view(login_require=False)
    def get(self, request, *args, **kwargs):
        if request.user and not isinstance(request.user, AnonymousUser):
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp.state is True:
                return redirect(request.query_params.get('next', reverse('HomeView')))
        session_flush(request=request)
        if check_home_domain(request) is True:
            return OutLayoutRender(request=request).render_404()
        ctx = {
            'ui_domain': settings.UI_DOMAIN,
            'captcha_enabled': settings.GG_RECAPTCHA_ENABLED,
            'secret_key_gg': settings.GG_RECAPTCHA_CLIENT_KEY if settings.GG_RECAPTCHA_ENABLED else None,
        }
        return render(request, 'auths/forgot_passwd.html', ctx)


class ForgotPasswordAPI(APIView):
    # default if user is unauthenticated so csrf check was skipped.
    # Keep CSRFCheckSessionAuthentication at view post without authenticated
    # Keep APIAllowAny at view post without permit action after check authenticated
    # if you aren't expert flow permission_classes and authentication_classes
    # please discuss with leader or using bastion option (not override classes)
    permission_classes = [APIAllowAny]  # force skip check permit action when skip authenticated
    authentication_classes = [CSRFCheckSessionAuthentication]  # force check csrf

    @mask_view(login_require=False, is_api=True)
    def post(self, request, *args, **kwargs):
        frm = ForgotPasswordForm(data=request.data)
        frm.is_valid()
        # get OTP first
        resp = ServerAPI(
            request=request, user=request.user, url=ApiURL.USER_FORGOT_PASSWORD,
            cus_headers={
                'Accept-Language': request.headers.get('Accept-Language', settings.LANGUAGE_CODE)
            }
        ).post(data=frm.cleaned_data)
        return resp.auto_return()


class ForgotPasswordDetailAPI(APIView):
    # default if user is unauthenticated so csrf check was skipped.
    # Keep CSRFCheckSessionAuthentication at view post without authenticated
    # Keep APIAllowAny at view post without permit action after check authenticated
    # if you aren't expert flow permission_classes and authentication_classes
    # please discuss with leader or using bastion option (not override classes)
    permission_classes = [APIAllowAny]  # force skip check permit action when skip authenticated
    authentication_classes = [CSRFCheckSessionAuthentication]  # force check csrf

    @mask_view(login_require=False, is_api=True)
    def get(self, request, *args, pk, **kwargs):
        captcha = self.request.query_params.dict().get('captcha', None)
        frm = ForgotPasswordResendOTP(
            data={
                'g_recaptcha_response': captcha,
                'pk': pk,
            }
        )
        frm.is_valid()
        # refresh push OTP
        if pk and TypeCheck.check_uuid(pk):
            resp = ServerAPI(
                request=request, user=request.user, url=ApiURL.USER_FORGOT_PASSWORD_DETAIL.fill_key(pk=pk)
            ).get()
            return resp.auto_return(key_success='forgot_password_data')
        return OutLayoutRender(request=request).render_404()

    @mask_view(login_require=False, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        frm = ForgotPasswordValidOTPForm(data={
            **request.data,
            'pk': pk,
        })
        frm.is_valid()
        # enter OTP
        if pk and TypeCheck.check_uuid(pk):
            resp = ServerAPI(
                request=request, user=request.user, url=ApiURL.USER_FORGOT_PASSWORD_DETAIL.fill_key(pk=pk)
            ).put(data=frm.cleaned_data)
            return resp.auto_return()
        return OutLayoutRender(request=request).render_404()


class ChangePasswordView(View):
    @mask_view(
        auth_require=True,
        template='auths/change_passwd.html',
        breadcrumb='USER_CHANGE_PASSWORD',
    )
    def get(self, request, *args, **kwargs):
        ctx = {'include_otp': False}
        token_cls = MyJWTClient(user=request.user)
        if token_cls.get_2fa_enabled() is True:
            ctx['include_otp'] = True
        return ctx, status.HTTP_200_OK


class ChangePasswordAPI(APIView):
    @mask_view(auth_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.USER_CHANGE_PASSWORD).put(data=request.data)
        return resp.auto_return()


class AuthLogsAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.AUTH_LOGS).get()
        return resp.auto_return(key_success='auth_logs')


class AuthLogReportsAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.AUTH_LOGS_REPORT).get()
        return resp.auto_return(key_success='auth_logs')
