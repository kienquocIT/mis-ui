from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI, PermCheck


class ShippingList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_list.html',
        breadcrumb='SHIPPING_LIST_PAGE',
        menu_active='id_menu_shipping_list',
        perm_check=PermCheck(url=ApiURL.SHIPPING_LIST, method='GET'),
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ShippingCreate(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_create.html',
        breadcrumb='SHIPPING_CREATE_PAGE',
        menu_active='menu_shipping_list',
        perm_check=PermCheck(url=ApiURL.SHIPPING_LIST, method='post'),
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
        return resp.auto_return(key_success='shipping_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_LIST).post(request.data)
        return resp.auto_return()


class ShippingDetail(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/shipping/shipping_detail.html',
        breadcrumb='SHIPPING_DETAIL_PAGE',
        menu_active='menu_shipping_list',
        perm_check=PermCheck(url=ApiURL.SHIPPING_DETAIL, method='GET', fill_key=['pk']),
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(url=ApiURL.CITIES, user=request.user).get()
        resp_unit = ServerAPI(url=ApiURL.ITEM_UNIT_LIST, user=request.user).get()
        if resp.state and resp_unit:
            result = {'cities': resp.result, 'unit': resp_unit.result}
            return result, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ShippingDetailAPI(APIView):
    @mask_view(
        is_api=True,
        auth_require=True
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='shipping')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        url = ApiURL.SHIPPING_DETAIL.fill_key(pk=pk)
        resp = ServerAPI(user=request.user, url=url).put(data=request.data)
        return resp.auto_return(key_success='shipping')


class ShippingCheckListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SHIPPING_CHECK_LIST).get(data)
        return resp.auto_return(key_success='shipping_check_list')
