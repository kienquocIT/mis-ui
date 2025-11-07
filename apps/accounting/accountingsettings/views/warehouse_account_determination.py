from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class WarehouseAccountDeterminationListAPI(APIView):
    permission_classes = [IsAuthenticated]  # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_ACCOUNT_DETERMINATION_LIST).get(params)
        return resp.auto_return(key_success='warehouse_account_determination_list')


class WarehouseAccountDeterminationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_ACCOUNT_DETERMINATION_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='detail')
