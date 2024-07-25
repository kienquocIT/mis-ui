from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, SaleMsg


class BudgetPlanList(View):
    @mask_view(
        auth_require=True,
        template='budget_plan/budget_plan_list.html',
        menu_active='menu_budget_plan_list',
        breadcrumb='BUDGET_PLAN_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BudgetPlanCreate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='budget_plan/budget_plan_create.html',
        menu_active='',
        breadcrumb='BUDGET_PLAN_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BudgetPlanDetail(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='budget_plan/budget_plan_detail.html',
        menu_active='',
        breadcrumb='BUDGET_PLAN_DETAIL_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BudgetPlanUpdate(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='budget_plan/budget_plan_update.html',
        menu_active='',
        breadcrumb='BUDGET_PLAN_UPDATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BudgetPlanListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_PLAN_LIST).get(data)
        return resp.auto_return(key_success='budget_plan_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_PLAN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.RP_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class BudgetPlanDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_PLAN_DETAIL.fill_key(pk=pk)).get(data)
        return resp.auto_return(key_success='budget_plan_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_PLAN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.RP_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
