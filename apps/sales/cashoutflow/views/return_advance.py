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
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        if resp.state:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'advance_payment': resp.result
                   }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ReturnAdvanceListAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_LIST).get()
        if resp.state:
            return {'return_advances': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *arg, **kwargs):
        data = request.data
        response = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_LIST).post(data)
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


class ReturnAdvanceDetail(View):
    @mask_view(
        auth_require=True,
        template='return_advance/return_advance_detail.html',
        breadcrumb='RETURN_ADVANCE_DETAIL_PAGE',
        menu_active='menu_return_advance_list',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ADVANCE_PAYMENT_LIST).get()
        if resp.state:
            return {
                       'employee_current_id': request.user.employee_current_data.get('id', None),
                       'advance_payment': resp.result
                   }, status.HTTP_200_OK
        return {}, status.HTTP_200_OK


class ReturnAdvanceDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, pk, *arg, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.RETURN_ADVANCE_DETAIL.fill_key(pk=pk)).get() # noqa
        if resp.state:
            return {'return_advance': resp.result}, status.HTTP_200_OK
        elif resp.status == 401:
            return {}, status.HTTP_401_UNAUTHORIZED
        return {'errors': resp.errors}, status.HTTP_400_BAD_REQUEST
