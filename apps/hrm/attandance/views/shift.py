from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


class ShiftMasterDataList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/attandance/shift/shift_list.html',
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
        print("ARSENAL IS THE CHAMPION")
        resp = ServerAPI(user=request.user, url=ApiURL.SHIFT_LIST).post(request.data)
        return resp.auto_return(key_success="shift_list")


