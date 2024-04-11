from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck


class InventoryInteractConfigList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/inventory_interact_config.html',
        breadcrumb='INVENTORY_INTERACT_CONFIG',
        menu_active='menu_inventory_interact_config',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST).get()
        return {
            'wh_list': resp.result
        }, status.HTTP_200_OK


class InventoryInteractConfigListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_INTERACT_LIST).get(params)
        return resp.auto_return(key_success='inventory_interact_config_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_INTERACT_LIST).post(request.data)
        return resp.auto_return()


class InventoryInteractConfigDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.INVENTORY_INTERACT_DETAIL.fill_key(pk=pk)).delete()
        return resp.auto_return(key_success='result')
