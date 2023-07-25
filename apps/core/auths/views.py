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
            resp_data = ServerAPI(user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp_data.state is True:
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
            resp_data = ServerAPI(user=request.user, url=ApiURL.API_FORWARD_ACCESS_TOKEN_MEDIA).post(
                data={
                    "company_id": company_id,
                    "access_id": access_id,
                    "user_agent": user_agent,
                    "public_ip": public_ip
                }
            )
            if resp_data.state is True:
                result = {
                    'id': resp_data.result['id'],
                    'access_code': resp_data.result['code'],
                    'secret_token_regis': resp_data.result['access_token_regis'],
                }
                return result, status.HTTP_200_OK
        return {}, status.HTTP_403_FORBIDDEN


class AuthLogin(APIView):
    permission_classes = [AllowAny]

    @classmethod
    def get(cls, request):
        if request.user and not isinstance(request.user, AnonymousUser):
            resp_data = ServerAPI(user=request.user, url=ApiURL.ALIVE_CHECK).get()
            if resp_data.state is True:
                return redirect(request.query_params.get('next', reverse('HomeView')))
        request.session.flush()
        request.user = AnonymousUser
        return render(request, 'auths/login.html', {'is_notify_key': False})

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
        resp_data = ServerAPI(user=None, url=ApiURL.login).post(frm.cleaned_data)
        match resp_data.state:
            case True:
                user = User.regis_with_api_result(resp_data.result)
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
                return {'detail': AuthMsg.login_exc, 'data': resp_data.result}, status.HTTP_400_BAD_REQUEST
            case False:
                return resp_data.errors, status.HTTP_400_BAD_REQUEST
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
        resp_data = ServerAPI(user=None, url=ApiURL.tenants).get()
        if resp_data.state:
            return Response({'result': resp_data.result}, status=200)
        return Response({'detail': resp_data.errors}, status=400)


class SwitchCompanyCurrentView(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.SWITCH_COMPANY).put(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        return {'detail': ServerMsg.SERVER_ERR}, status.HTTP_500_INTERNAL_SERVER_ERROR


class SpaceChangeView(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        space_code = request.data.get('space_code')
        if space_code:
            request.user.ui_space_selected = space_code
            request.user.save(update_fields=['ui_space_selected'])
            return {}, status.HTTP_200_OK
        return {'space_code': 'Space Code is required'}
