import requests
import xmltodict
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, MDConfigMsg, PermCheck


class BudgetPlanConfigList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/budget_plan_config.html',
        breadcrumb='BUDGET_PLAN_CONFIG_PAGE',
        menu_active='id_menu_master_data_budget_plan_config',
    )
    def get(self, request, *args, **kwargs):
        resp0 = ServerAPI(url=ApiURL.BUDGET_PLAN_CONFIG_LIST, user=request.user).get()
        return {
            'budget_plan_config': resp0.result,
        }, status.HTTP_200_OK


class BudgetPlanConfigListAPI(APIView):
    permission_classes = [IsAuthenticated] # noqa

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_PLAN_CONFIG_LIST).get(params)
        return resp.auto_return(key_success='budget_plan_config')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BUDGET_PLAN_CONFIG_LIST).post(request.data)
        return resp.auto_return()
