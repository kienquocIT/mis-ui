from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI
from django.utils.translation import gettext_lazy as _


class ShippingList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_list.html',
        breadcrumb='SHIPPING_LIST_PAGE',
        menu_active='id_menu_shipping_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ShippingCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_create.html',
        breadcrumb='SHIPPING_CREATE_PAGE',
        menu_active='menu_shipping_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.CITIES, user=request.user).get()
        resp_unit = ServerAPI(url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        if resp.state and resp_unit.state:
            return {'cities': resp.result, 'unit': resp_unit.result}, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ShippingListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_LIST).get()
        if resp.state:
            return {'shipping_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        else:
            return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data  # noqa
        response = ServerAPI(user=request.user, url=ApiURL.SHIPPING_LIST).post(data)
        if response.state:
            return response.result, status.HTTP_200_OK
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class ShippingDetail(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_detail.html',
        breadcrumb='SHIPPING_DETAIL_PAGE',
        menu_active='menu_shipping_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.CITIES, user=request.user).get()
        resp_unit = ServerAPI(url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        if resp.state and resp_unit:
            return {
                       'cities': resp.result, 'unit': resp_unit.result
                   }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ShippingDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_DETAIL.fill_key(shipping_id=pk)).get()
        if resp.state:
            return {'shipping': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_DETAIL.fill_key(shipping_id=pk)).put(  # noqa
            request.data
        )
        if resp.state:
            return {'shipping': resp.result}, status.HTTP_200_OK
        if resp.errors:  # noqa
            if isinstance(resp.errors, dict):
                err_msg = ""
                for key, value in resp.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class ShippingCheckListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_CHECK_LIST).get(data)
        if resp.state:
            return {'shipping_check_list': resp.result}, status.HTTP_200_OK

        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': _('Failed to load resource')}, status.HTTP_400_BAD_REQUEST
