from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL, HRMsg


class ShiftMasterDataList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/attendance/shift/shift_list.html',
        menu_active='id_menu_master_data_shift',
        breadcrumb='MASTER_DATA_SHIFT_PAGE',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ShiftMasterDataListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.SHIFT_LIST).get(params)
        return resp.auto_return(key_success="shift_list")

    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIFT_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = HRMsg.SHIFT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class ShiftMasterDataDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIFT_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='shift_detail')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIFT_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return(key_success='shift_detail')


class ShiftImportAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.SHIFT_IMPORT).post(request.data)
        if resp.state:
            resp.result['message'] = HRMsg.SHIFT_CREATE
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
