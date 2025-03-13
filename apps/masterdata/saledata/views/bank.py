from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

class BankMasterDataListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_LIST).get(params)
        return resp.auto_return(key_success='bank_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_LIST).post(request.data)
        return resp.auto_return(key_success='bank_list')

class BankMasterDataDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='bank_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_DETAIL.push_id(pk)).put(request.data)
        return resp.auto_return(key_success='bank_detail')


class BankAccountMasterDataListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_ACCOUNT_LIST).get(params)
        return resp.auto_return(key_success='bank_account_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_ACCOUNT_LIST).post(request.data)
        return resp.auto_return(key_success='bank_account_list')


class BankAccountMasterDataDetailAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_ACCOUNT_DETAIL.push_id(pk)).get()
        return resp.auto_return(key_success='bank_account_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BANK_ACCOUNT_DETAIL.push_id(pk)).put(request.data)
        return resp.auto_return(key_success='bank_account_detail')
