from django.views import View
from rest_framework import status
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI

__all__ = ['WareHouseList', 'WareHouseListAPI', 'WareHouseDetailAPI']


class WareHouseList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/warehouse/list.html',
        breadcrumb='WAREHOUSE_LIST_PAGE',
        menu_active='menu_warehouse_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class WareHouseListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST).get()
        if resp.state:
            return {'warehouse_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        response = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_LIST).post(request.data)
        if response.state:
            return response.result, status.HTTP_201_CREATED
        if response.errors:
            if isinstance(response.errors, dict):
                err_msg = ""
                for key, value in response.errors.items():
                    err_msg += str(key) + ': ' + str(value)
                    break
                return {'errors': err_msg}, status.HTTP_400_BAD_REQUEST
            return {}, status.HTTP_500_INTERNAL_SERVER_ERROR
        return {}, status.HTTP_500_INTERNAL_SERVER_ERROR


class WareHouseDetailAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_DETAIL.fill_key(pk=pk)).get()
        if resp.state:
            return {'warehouse_list': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            return {'detail': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def delete(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WAREHOUSE_DETAIL.fill_key(pk=pk)).delete()
        if resp.state:
            return {'result': resp.result}, status.HTTP_204_NO_CONTENT
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
