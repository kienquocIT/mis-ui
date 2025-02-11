from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.constant import SYSTEM_STATUS
from apps.shared.msg import BaseMsg


def create(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


def update(request, url, pk, msg):
    resp = ServerAPI(user=request.user, url=url.push_id(pk)).put(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class FixedAssetList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/fixedasset/fixedasset_list.html',
        menu_active='menu_fixed_asset',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class FixedAssetCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/fixedasset/fixedasset_create.html',
        menu_active='menu_fixed_asset',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'form_id': '',
        }
        return ctx, status.HTTP_200_OK

class FixedAssetDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/fixedasset/fixedasset_detail.html',
        menu_active='menu_fixed_asset',
        breadcrumb='',
    )
    def get(self, request, pk, *args, **kwargs):
        ctx = {
            'form_id': '',
        }
        return ctx, status.HTTP_200_OK

class FixedAssetListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_LIST).get(data)
        return resp.auto_return(key_success='fixed_asset_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create(
            request=request,
            url=ApiURL.FIXED_ASSET_LIST,
            msg=BaseMsg.SUCCESS
        )

class FixedAssetDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.FIXED_ASSET_DETAIL.push_id(pk)).get()
        return resp.auto_return()
