from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared.apis import RespData
from apps.shared.constant import TYPE_CUSTOMER, ROLE_CUSTOMER
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg, PermCheck, TypeCheck


class RevenuePlanList(View):
    @mask_view(
        auth_require=True,
        template='revenue_plan/revenue_plan_list.html',
        menu_active='menu_revenue_plan_list',
        breadcrumb='REVENUE_PLAN_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class RevenuePlanCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='revenue_plan/revenue_plan_create.html',
        menu_active='',
        breadcrumb='REVENUE_PLAN_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.REVENUE_PLAN_CONFIG_LIST, user=request.user).get()
        return {
            'revenue_plan_config': resp0.result,
        }, status.HTTP_200_OK


class RevenuePlanDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='revenue_plan/revenue_plan_detail.html',
        menu_active='',
        breadcrumb='REVENUE_PLAN_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.REVENUE_PLAN_CONFIG_LIST, user=request.user).get()
        return {
            'revenue_plan_config': resp0.result,
        }, status.HTTP_200_OK


class RevenuePlanUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='revenue_plan/revenue_plan_update.html',
        menu_active='',
        breadcrumb='REVENUE_PLAN_UPDATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.REVENUE_PLAN_CONFIG_LIST, user=request.user).get()
        return {
            'revenue_plan_config': resp0.result,
        }, status.HTTP_200_OK


class RevenuePlanListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.REVENUE_PLAN_LIST).get(data)
        return resp.auto_return(key_success='revenue_plan_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.REVENUE_PLAN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.RP_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class RevenuePlanDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.REVENUE_PLAN_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='revenue_plan_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.REVENUE_PLAN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.RP_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
