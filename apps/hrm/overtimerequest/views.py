__all__ = ['OvertimeList', 'OvertimeListAPI', 'OvertimeCreate', 'OvertimeDetail', 'OvertimeDetailAPI',
           'OvertimeUpdate', 'OvertimeUpdateAPI']

from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL
from apps.shared.msg import BaseMsg
from apps.shared.msg.hrm_employee import HRMMsg


class OvertimeList(View):
    @mask_view(
        auth_require=True,
        template='hrm/overtime/list.html',
        breadcrumb='HRM_OVERTIME_LIST_PAGE',
        menu_active='menu_overtime_request',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class OvertimeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_OVERTIME_REQUEST_LIST).get(request.query_params.dict())
        return resp.auto_return(key_success='overtime_request_list')

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_OVERTIME_REQUEST_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_OVERTIME} {BaseMsg.CREATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()


class OvertimeCreate(View):
    @mask_view(
        auth_require=True,
        template='hrm/overtime/create.html',
        breadcrumb='HRM_OVERTIME_CREATE_PAGE',
        menu_active='menu_overtime_request',
    )
    def get(self, request, *args, **kwargs):
        return {}, ServerAPI.empty_200()


class OvertimeDetail(View):
    @mask_view(
        auth_require=True,
        template='hrm/overtime/detail.html',
        breadcrumb='HRM_OVERTIME_DETAIL_PAGE',
        menu_active='menu_overtime_request',
    )
    def get(self, request, *args, pk, **kwargs):
        return {'pk': pk}, ServerAPI.empty_200()


class OvertimeDetailAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def get(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_OVERTIME_REQUEST_DETAIL.fill_key(pk=pk)).get()
        return resp.auto_return()


class OvertimeUpdate(View):
    @mask_view(
        auth_require=True,
        template='hrm/overtime/edit.html',
        breadcrumb='HRM_OVERTIME_UPDATE_PAGE',
        menu_active='menu_overtime_request',
    )
    def get(self, request, *args, pk, **kwargs):
        return {'pk': pk}, ServerAPI.empty_200()


class OvertimeUpdateAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.HRM_OVERTIME_REQUEST_DETAIL.fill_key(pk=pk)).put(request.data)
        if resp.state:
            resp.result['message'] = f'{HRMMsg.HRM_OVERTIME} {BaseMsg.UPDATE} {BaseMsg.SUCCESS}'
            return resp.result, status.HTTP_200_OK
        return resp.auto_return()
