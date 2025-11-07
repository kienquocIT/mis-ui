from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class AccountDeterminationList(View):

    @mask_view(
        auth_require=True,
        template='accountingsettings/account_determination/account_determination.html',
        breadcrumb='ACCOUNT_DETERMINATION_LIST_PAGE',
        menu_active='menu_account_determination_list',
        icon_cls='fas bi bi-journal-text',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class AccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='account_determination_list')


class AccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='account_determination_detail')
