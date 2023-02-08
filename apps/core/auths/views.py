from django.contrib.auth import authenticate, login
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import logout
from django.utils.translation import gettext_lazy as _

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import AuthLoginForm
from apps.shared import ServerAPI, ApiURL, mask_view, AuthMsg, ServerMsg
from apps.core.account.models import User


class AuthLogin(APIView):
    permission_classes = [AllowAny]

    @classmethod
    def get(cls, request, template='auths/login.html'):
        if request.user and not isinstance(request.user, AnonymousUser):
            resp_data = ServerAPI(user=request.user, url=ApiURL.my_profile).get()
            if resp_data.state is True:
                return redirect(request.query_params.get('next', reverse('HomeView')))
        request.session.flush()
        request.user = AnonymousUser
        return render(request, template, {})

    @classmethod
    def post(cls, request, *args, **kwargs):
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
                    return Response({'detail': AuthMsg.login_success, 'data': resp_data.result}, status=200)
                return Response({'detail': AuthMsg.login_exc, 'data': resp_data.result}, status=400)
            case False:
                return Response({
                    'detail': [f'{_(key)}: {value}' for key, value in resp_data.errors.items()]}, status=400
                )
        return Response({'detail': ServerMsg.SERVER_ERR}, status=500)


class AuthLogout(APIView):
    permission_classes = [IsAuthenticated]

    @classmethod
    def get(cls, request):
        logout(request)
        request.user = AnonymousUser
        return redirect(reverse('AuthLogin'))


class TenantLoginChoice(APIView):
    permission_classes = [AllowAny]

    @mask_view(auth_require=False, is_api=True)
    def get(self, request):
        resp_data = ServerAPI(user=None, url=ApiURL.tenants).get()
        if resp_data.state:
            return Response({'result': resp_data.result}, status=200)
        return Response({'detail': resp_data.errors}, status=400)
