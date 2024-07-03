from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import AppMsg


# Subscription Plan
class PlanListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.PLAN_LIST, user=request.user).get()
        return resp.auto_return(key_success='plan_list')


# Tenant application list
class TenantApplicationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, url=ApiURL.TENANT_APPLICATION_LIST, user=request.user).get(data=data)
        return resp.auto_return(key_success='tenant_application_list')


class ApplicationDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.APPLICATION_DETAIL.fill_key(pk=pk), user=request.user).get()
        return resp.auto_return(key_success='application_detail')


# Application properties list
class ApplicationPropertyListAPI(APIView):
    @mask_view(
        login_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.APPLICATION_PROPERTY_LIST, user=request.user).get(
            request.query_params.dict()
        )
        return resp.auto_return(key_success='application_property_list')


class ApplicationPropertyEmployeeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.APPLICATION_PROPERTY_EMPLOYEE_LIST).get()
        return resp.auto_return(key_success='property_employee_list')


class ApplicationPermissionAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.APPLICATION_PERMISSION).get(data)
        return resp.auto_return(key_success='perm_per_app')


class CountryListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.COUNTRIES, user=request.user).get()
        return resp.auto_return(key_success='countries')


class CityListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.CITIES, user=request.user).get()
        return resp.auto_return(key_success='cities')


class DistrictListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.DISTRICTS).get(data={'city_id': pk})
        return resp.auto_return(key_success='districts')


class DistrictAllListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.DISTRICTS).get()
        return resp.auto_return(key_success='districts')


class WardListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.WARDS, user=request.user).get(data={'district_id': pk})
        return resp.auto_return(key_success='wards')


class WardAllListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.WARDS, user=request.user).get()
        return resp.auto_return(key_success='wards')


class BaseCurrencyListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.BASE_CURRENCY, user=request.user).get()
        return resp.auto_return(key_success='base_currencies')


class BaseItemUnitListAPI(APIView):
    @mask_view(  # noqa
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        return resp.auto_return(key_success='base_item_units')


class IndicatorParamListAPI(APIView):
    @mask_view(  # noqa
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(request=request, url=ApiURL.INDICATOR_PARAM, user=request.user).get(data)
        return resp.auto_return(key_success='indicator_param')


class ApplicationPropertyOpportunityListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.APPLICATION_PROPERTY_OPPORTUNITY_LIST).get()
        return resp.auto_return(key_success='property_opportunity_list')


class ApplicationForOpportunityPermitListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.APPLICATION_OPPORTUNITY_PERMISSION).get()
        return resp.auto_return(key_success='applications')


# ZONES
def create_zones(request, url, msg):
    resp = ServerAPI(user=request.user, url=url).post(request.data)
    if resp.state:
        resp.result['message'] = msg
        return resp.result, status.HTTP_201_CREATED
    return resp.auto_return()


class ZonesApplicationListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ZONES_APPLICATION_LIST).get(data)
        return resp.auto_return(key_success='zones_application_list')


class ZonesCreate(View):
    @mask_view(
        auth_require=True,
        template='core/base/zones_create.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        ctx = {}
        return ctx, status.HTTP_200_OK


class ZonesListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ZONES_LIST).get(data)
        return resp.auto_return(key_success='zones_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return create_zones(
            request=request,
            url=ApiURL.ZONES_LIST,
            msg=AppMsg.ZONES_CREATE
        )


class ZonesList(View):
    @mask_view(
        auth_require=True,
        template='core/base/zones_list.html',
        menu_active='',
        breadcrumb='ZONES_LIST_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
