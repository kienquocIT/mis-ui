from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PermCheck


class GoodsIssueList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/list.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_LIST_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_ISSUE_LIST, method='get'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsIssueCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/create.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_CREATE_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_ISSUE_LIST, method='post'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsIssueDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/detail.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_DETAIL_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_ISSUE_DETAIL, method='get', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK


class GoodsIssueListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_LIST).get(data)
        return resp.auto_return(key_success='goods_issue_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_LIST).post(request.data)
        return resp.auto_return(status_success=status.HTTP_201_CREATED)


class GoodsIssueDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.GOODS_ISSUE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='goods_issue_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.GOODS_ISSUE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()

class GoodsIssueUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/inventory/goods_issue/update.html',
        menu_active='menu_goods_issue_list',
        breadcrumb='GOODS_ISSUE_UPDATE_PAGE',
        perm_check=PermCheck(url=ApiURL.GOODS_ISSUE_DETAIL, method='PUT', fill_key=['pk']),
    )
    def get(self, request, pk, *args, **kwargs):
        return {}, status.HTTP_200_OK
