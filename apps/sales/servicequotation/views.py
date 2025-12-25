from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import ServerAPI, ApiURL, mask_view, SaleMsg, InputMappingProperties


class ServiceQuotationList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/servicequotation/service_quotation_list.html',
        menu_active='menu_service_quotation_list',
        breadcrumb='SERVICE_QUOTATION_LIST_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ServiceQuotationCreate(View):
    @mask_view(
        auth_require=True,
        template='sales/servicequotation/service_quotation_create.html',
        menu_active='menu_service_quotation_list',
        breadcrumb='SERVICE_QUOTATION_CREATE_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, *args, **kwargs):
        ctx = {
            'form_id': 'form-create-service-quotation',
            'app_id': 'c9e131ec760c45af8ae65349f2bb542e',
            'list_from_app': 'servicequotation.servicequotation.create',
            'input_mapping_properties': InputMappingProperties.SERVICE_QUOTATION_DATA_MAP,
            'employee_info': request.user.employee_current_data,
        }
        return ctx, status.HTTP_200_OK


class ServiceQuotationDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/servicequotation/service_quotation_detail.html',
        menu_active='menu_service_quotation_list',
        breadcrumb='SERVICE_QUOTATION_DETAIL_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
            'form_id': 'form-detail-service-quotation',
            'app_id': 'c9e131ec760c45af8ae65349f2bb542e',
            'input_mapping_properties': InputMappingProperties.SERVICE_QUOTATION_DATA_MAP,
            'employee_info': request.user.employee_current_data,
        }, status.HTTP_200_OK


class ServiceQuotationUpdate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/servicequotation/service_quotation_update.html',
        menu_active='menu_service_quotation_list',
        breadcrumb='SERVICE_QUOTATION_UPDATE_PAGE',
        icon_cls='fas fa-concierge-bell',
        icon_bg='bg-primary',
    )
    def get(self, request, pk, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        ctx = {
            'pk': pk,
            'data': {'doc_id': pk},
            'form_id': 'form-update-service-quotation',
            'app_id': 'c9e131ec760c45af8ae65349f2bb542e',
            'list_from_app': 'servicequotation.servicequotation.edit',
            'input_mapping_properties': InputMappingProperties.SERVICE_QUOTATION_DATA_MAP,
            'employee_current': employee_current,
            'employee_info': request.user.employee_current_data,
        }
        return ctx, status.HTTP_200_OK


class ServiceQuotationListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SERVICE_QUOTATION_LIST).get(params)
        return resp.auto_return(key_success='service_quotation_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SERVICE_QUOTATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.SERVICE_QUOTATION_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class ServiceQuotationDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.SERVICE_QUOTATION_DETAIL.fill_key(pk=pk)
        ).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(
            user=request.user,
            url=ApiURL.SERVICE_QUOTATION_DETAIL.fill_key(pk=pk)
        ).put(request.data)
        if resp.state:
            resp.result['message'] = SaleMsg.SERVICE_QUOTATION_UPDATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
