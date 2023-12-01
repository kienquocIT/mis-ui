from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, InputMappingProperties
from apps.shared.constant import SYSTEM_STATUS

__all__ = ['BusinessTripRequestList', 'BusinessTripRequestListAPI', 'BusinessTripRequestDetail', 'BusinessTripCreate',
           'BusinessTripRequestCreateAPI', 'BusinessTripRequestEdit', 'BusinessTripRequestEditAPI',
           'BusinessTripRequestDetailAPI']

from apps.shared.msg import BaseMsg

from apps.shared.msg.eoffice import BusinessTripMsg


class BusinessTripRequestList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='e-offices/business-trip/list.html',
        menu_active='menu_business',
        breadcrumb='BUSINESS_TRIP_REQUEST',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class BusinessTripRequestListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BUSINESS_TRIP_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='business_trip_request')


class BusinessTripCreate(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='e-offices/business-trip/create.html',
        menu_active='menu_business',
        breadcrumb='BUSINESS_TRIP_CREATE',
    )
    def get(self, request, *args, **kwargs):
        reps_employee = ServerAPI(
            user=request.user, url=ApiURL.EMPLOYEE_DETAIL_PK.fill_key(pk=request.user.employee_current_data['id'])
        ).get({'list_from_app': 'businesstrip.businessrequest.create'})
        current_emp = {}
        if reps_employee.state:
            current_emp = {
                'id': reps_employee.result['id'],
                'last_name': reps_employee.result['last_name'],
                'first_name': reps_employee.result['first_name'],
                'full_name': reps_employee.result['full_name'],
                'selected': 'true'
            }
        return {
                   'employee_inherit': current_emp
               }, status.HTTP_200_OK


class BusinessTripRequestCreateAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BUSINESS_TRIP_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{BusinessTripMsg.BUSINESS_TRIP} {BaseMsg.CREATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class BusinessTripRequestDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='e-offices/business-trip/detail.html',
        menu_active='menu_business',
        breadcrumb='BUSINESS_TRIP_DETAIL',
    )
    def get(self, request, pk, *args, **kwargs):
        return {
                   'system_status': SYSTEM_STATUS,
                   'pk': pk,
               }, status.HTTP_200_OK


class BusinessTripRequestDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BUSINESS_TRIP_DETAIL.push_id(pk)).get()
        return resp.auto_return()


class BusinessTripRequestEdit(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='e-offices/business-trip/edit.html',
        menu_active='menu_business',
        breadcrumb='BUSINESS_TRIP_EDIT',
    )
    def get(self, request, pk, *args, **kwargs):
        input_mapping_properties = InputMappingProperties.BUSINESS_TRIP_DATA_MAP
        return {
                   'input_mapping_properties': input_mapping_properties,
                   'form_id': 'business_trip_form',
                   'pk': pk,
                   'system_status': SYSTEM_STATUS,
               }, status.HTTP_200_OK


class BusinessTripRequestEditAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.BUSINESS_TRIP_DETAIL.push_id(pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{BusinessTripMsg.BUSINESS_TRIP} {BaseMsg.UPDATE} {BaseMsg.SUCCESSFULLY}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
