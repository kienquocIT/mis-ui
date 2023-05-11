from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class ShippingList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_list.html',
        breadcrumb='SHIPPING_LIST_PAGE',
        menu_active='menu_shipping_list',
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
        if resp.state:
            return {'cities': resp.result}, status.HTTP_200_OK
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
