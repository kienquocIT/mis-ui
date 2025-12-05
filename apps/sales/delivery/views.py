from functools import reduce

from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, PICKING_STATE, InputMappingProperties, BaseView

__all__ = [
    'DeliveryConfigDetail', 'DeliveryConfigDetailAPI', 'OrderPickingList', 'OrderPickingListAPI', 'OrderPickingDetail',
    'OrderPickingDetailAPI', 'OrderDeliveryList', 'OrderDeliveryListAPI', 'OrderDeliveryDetail',
    'OrderDeliveryDetailAPI', 'OrderDeliveryEdit', 'OrderPickingEdit',
    'OrderDeliveryCreate', 'DeliveryForRecoveryListAPI', 'DeliveryProductLeaseListAPI',
    'OrderDeliveryDetailPrintAPI', 'DeliveryWorkLogListAPI',
]

from apps.shared.constant import DELIVERY_STATE, SYSTEM_STATUS


def check_config_lead(user, get_p_or_d='picking'):
    resp = ServerAPI(user=user, url=ApiURL.DELIVERY_CONFIG).get()
    is_lead = False
    person_list = []
    lead = {}
    kwag_lead = f'lead_{get_p_or_d}'  # noqa
    kwag_person = f'person_{get_p_or_d}'  # noqa
    if resp.state and kwag_lead in resp.result and kwag_person in resp.result:
        lead = resp.result[kwag_lead]
        if lead.get("id") == user.employee_current_data.get("id"):
            is_lead = True
        person_list = resp.result[kwag_person]
    return is_lead, lead, person_list


class DeliveryConfigDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='sales/delivery/config.html',
        menu_active='menu_delivery_config',
        breadcrumb='DELIVERY_CONFIG',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).get()
        return resp.auto_return(key_success='config_data')


class DeliveryConfigDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).get()
        return resp.auto_return(key_success='config')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_CONFIG).put(request.data)
        return resp.auto_return(key_success='result')


class OrderPickingList(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/picking/list.html',
        breadcrumb='ORDER_PICKING_LIST_PAGE',
        menu_active='menu_order_picking_list',
    )
    def get(self, request, *args, **kwargs):
        return {'state_choices': {key: value for key, value in PICKING_STATE}}, status.HTTP_200_OK


class OrderPickingListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PICKING_LIST).get(params)
        return resp.auto_return(key_success='picking_list')


class OrderPickingDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/picking/detail.html',
        breadcrumb='ORDER_PICKING_DETAIL_PAGE',
        menu_active='menu_order_picking_list',
    )
    def get(self, request, *args, pk, **kwargs):
        is_lead, p_lead, person_p = check_config_lead(request.user)
        result = {
            'pk': pk,
            'state_choices': {key: value for key, value in PICKING_STATE},
            'is_lead': is_lead,
            'lead': p_lead,
            'person_list': person_p
        }
        return result, status.HTTP_200_OK


class OrderPickingEdit(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/picking/edit.html',
        breadcrumb='ORDER_PICKING_EDIT_PAGE',
        menu_active='menu_order_picking_list',
    )
    def get(self, request, *args, pk, **kwargs):
        is_lead, p_lead, person_p = check_config_lead(request.user)
        result = {
            'pk': pk,
            'state_choices': {key: value for key, value in PICKING_STATE},
            'is_lead': is_lead,
            'lead': p_lead,
            'person_list': person_p
        }
        return result, status.HTTP_200_OK


class OrderPickingDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_PICKING_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='picking_detail')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.DELIVERY_PICKING_DETAIL,
            pk=pk,
        )


class OrderDeliveryList(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/list.html',
        breadcrumb='ORDER_DELIVERY_LIST_PAGE',
        menu_active='menu_order_delivery_list',
        icon_cls='fas fa-truck',
        icon_bg='bg-gold',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'state_choices': {key: value for key, value in DELIVERY_STATE},
                   'stt_sys': SYSTEM_STATUS,
               }, status.HTTP_200_OK


class OrderDeliveryCreate(View):
    @mask_view(
        login_require=True,
        template='sales/delivery/create.html',
        breadcrumb='ORDER_DELIVERY_CREATE_PAGE',
        menu_active='menu_order_delivery_list',
        jsi18n='delivery',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OrderDeliveryListAPI(APIView):

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LIST).get(params)
        return resp.auto_return(key_success='delivery_list')

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_LIST.push_id(pk=pk)).put(request.data)
        if resp.state:
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class OrderDeliveryDetail(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/detail.html',
        breadcrumb='ORDER_DELIVERY_DETAIL_PAGE',
        menu_active='menu_order_delivery_list',
        icon_cls='fas fa-truck',
        icon_bg='bg-gold',
    )
    def get(self, request, *args, pk, **kwargs):
        is_lead, lead, person_list = check_config_lead(request.user, 'delivery')
        input_mapping_properties = InputMappingProperties.DELIVERY_ORDER_DELIVERY
        result = {
            'pk': pk,
            'state_choices': {key: value for key, value in DELIVERY_STATE},
            'is_lead': is_lead,
            'lead': lead,
            'person_list': person_list,
            'input_mapping_properties': input_mapping_properties,
        }
        return result, status.HTTP_200_OK


class OrderDeliveryEdit(View):
    @mask_view(
        auth_require=True,
        template='sales/delivery/edit.html',
        breadcrumb='ORDER_DELIVERY_EDIT_PAGE',
        menu_active='menu_order_delivery_list',
        icon_cls='fas fa-truck',
        icon_bg='bg-gold',
    )
    def get(self, request, *args, pk, **kwargs):
        input_mapping_properties = InputMappingProperties.DELIVERY_ORDER_DELIVERY
        is_lead, lead, person_list = check_config_lead(request.user, 'delivery')
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        result = {
            'pk': pk,
            'state_choices': {key: value for key, value in DELIVERY_STATE},
            'input_mapping_properties': input_mapping_properties,
            'form_id': 'delivery_form',
            'is_lead': is_lead,
            'lead': lead,
            'person_list': person_list,
            'employee_current': employee_current,
        }
        return result, status.HTTP_200_OK


class OrderDeliveryDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SUB_LIST.fill_key(pk=pk)).get()
        return resp.auto_return()

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.DELIVERY_SUB_LIST,
            pk=pk,
        )


# PRINT VIEW
class OrderDeliveryDetailPrintAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_SUB_PRINT_LIST.fill_key(pk=pk)).get()
        return resp.auto_return()


class DeliveryForRecoveryListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.DELIVERY_FOR_RECOVERY_LIST).get(data)
        return resp.auto_return(key_success='delivery_for_recovery_list')


class DeliveryProductLeaseListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.DELIVERY_PRODUCT_LEASE_LIST).get(data)
        return resp.auto_return(key_success='delivery_product_lease')


class DeliveryWorkLogListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.DELIVERY_WORK_LOG_LIST).get(data)
        return resp.auto_return(key_success='delivery_work_log')
