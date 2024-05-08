from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck, SaleMsg


class GoodsDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_detail/goods_detail.html',
        menu_active='menu_goods_detail_list',
        breadcrumb='GOODS_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_DETAIL_LIST).get(data)
        return resp.auto_return(key_success='goods_detail_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.UPDATE_GOODS_DETAIL_DATA_LIST).post(request.data)
        resp.result['message'] = SaleMsg.GOODS_DETAIL_UPDATE
        return resp.auto_return(status_success=status.HTTP_201_CREATED)
