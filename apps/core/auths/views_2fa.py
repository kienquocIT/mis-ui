from django.contrib.auth import login
from rest_framework import status
from rest_framework.views import APIView
from django.views import View
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL, TypeCheck
from apps.shared.apis import RespData


class MyProfileView(View):
    @mask_view(
        login_require=True,
        template='auths_2fa/my_profile.html',
        jsi18n='auth',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TwoFAVerifyView(View):
    @mask_view(
        login_require=True,
        template='auths_2fa/verify.html',
        # breadcrumb='USER_LIST_PAGE',
        # menu_active='menu_user_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class TwoFAVerifyAPIView(APIView):
    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        otp = request.data.get('otp', None)
        if otp:
            data = {'otp': otp}
            resp = ServerAPI(request=request, user=request.user, url=ApiURL.TWO_FA).post(data=data)
            if resp.state is True:
                user = request.user.regis_with_api_result(resp.result)
                login(request, user)
            return resp.auto_return(key_success='2fa')
        ctx = {
            'otp': _("The OTP code is required"),
        }
        return ctx, status.HTTP_400_BAD_REQUEST


class TwoFAIntegrateAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TWO_FA_INTEGRATE).get()
        return resp.auto_return(key_success='2fa')

    @mask_view(login_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TWO_FA_INTEGRATE).post(data={})
        return resp.auto_return(key_success='2fa')

    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.TWO_FA_INTEGRATE).put(data=request.data)
        return resp.auto_return(key_success='2fa')


class TwoFAIntegrateDetailAPI(APIView):
    @mask_view(login_require=True, is_api=True)
    def put(self, request, *args, pk, **kwargs):
        if pk and TypeCheck.check_uuid(pk):
            try:
                otp = int(request.data.get('otp', ''))
            except ValueError:
                return RespData.resp_400(
                    {
                        'otp': _("The otp is required")
                    }
                )
            else:
                url = ApiURL.TWO_FA_INTEGRATE_DETAIL.fill_key(pk=pk)
                data = {'otp': otp}
                resp = ServerAPI(request=request, user=request.user, url=url).put(data=data)
                return resp.auto_return(key_success='2fa')
        return RespData.resp_404()
