from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class ReturnAdvanceList(View):

    @mask_view(
        auth_require=True,
        template='return_advance/return_advance_list.html',
        breadcrumb='RETURN_ADVANCE_LIST_PAGE',
        menu_active='id_menu_return_advance',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class ReturnAdvanceCreate(View):

    @mask_view(
        auth_require=True,
        template='return_advance/return_advance_create.html',
        breadcrumb='RETURN_ADVANCE_CREATE_PAGE',
        menu_active='menu_return_advance_list',
    )
    def get(self, request, *args, **kwargs):
        return {
                   'employee_current_id': request.user.employee_current_data.get('id', None),
               }, status.HTTP_200_OK


class ReturnAdvanceListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_LIST).get()
        return resp.auto_return(key_success='return_advances')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_LIST).post(request.data)
        return resp.auto_return()


class ReturnAdvanceDetail(View):
    @mask_view(
        auth_require=True,
        template='return_advance/return_advance_detail.html',
        breadcrumb='RETURN_ADVANCE_DETAIL_PAGE',
        menu_active='menu_return_advance_list',
    )
    def get(self, request, *args, **kwargs):
        result = {
            'employee_current_id': request.user.employee_current_data.get('id', None),
        }
        return result, status.HTTP_200_OK


class ReturnAdvanceDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return(key_success='return_advance')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def put(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_DETAIL.fill_key(pk=pk)).put(request.data)
        return resp.auto_return()
