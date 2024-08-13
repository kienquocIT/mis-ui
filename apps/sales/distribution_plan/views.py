from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, SaleMsg, InputMappingProperties


class DistributionPlanList(View):
    @mask_view(
        auth_require=True,
        template='sales/distribution_plan/distribution_plan_list.html',
        breadcrumb='DISTRIBUTION_PLAN_LIST_PAGE',
        menu_active='menu_distribution_plan_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class DistributionPlanCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/distribution_plan/distribution_plan_create.html',
        breadcrumb='DISTRIBUTION_PLAN_CREATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.DISTRIBUTION_PLAN_DB
        return {
            'input_mapping_properties': input_mapping_properties,
            'list_from_app': 'distribution_plan.distributionplan.create',
            'form_id': 'form-create-dp'
        }, status.HTTP_200_OK


class DistributionPlanDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/distribution_plan/distribution_plan_detail.html',
        breadcrumb='DISTRIBUTION_PLAN_DETAIL_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.DISTRIBUTION_PLAN_DB
        return {
            'input_mapping_properties': input_mapping_properties,
            'list_from_app': 'distribution_plan.distributionplan.create',
            'form_id': 'form-detail-dp'
        }, status.HTTP_200_OK


class DistributionPlanUpdate(View):
    @mask_view(
        auth_require=True,
        template='sales/distribution_plan/distribution_plan_update.html',
        breadcrumb='DISTRIBUTION_PLAN_UPDATE_PAGE',
        menu_active='',
    )
    def get(self, request, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.DISTRIBUTION_PLAN_DB
        return {
            'input_mapping_properties': input_mapping_properties,
            'list_from_app': 'distribution_plan.distributionplan.edit',
            'form_id': 'form-detail-dp'
        }, status.HTTP_200_OK


class DistributionPlanListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DISTRIBUTION_PLAN_LIST).get(params)
        return resp.auto_return(key_success='distribution_plan_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DISTRIBUTION_PLAN_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.DISTRIBUTION_PLAN_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class DistributionPlanDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DISTRIBUTION_PLAN_DETAIL.fill_key(pk=pk)).get(params)
        return resp.auto_return(key_success='distribution_plan_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        data = request.data
        resp = ServerAPI(user=request.user, url=ApiURL.DISTRIBUTION_PLAN_DETAIL.fill_key(pk=pk)).put(data)
        if resp.state:
            resp.result['message'] = SaleMsg.DISTRIBUTION_PLAN_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
