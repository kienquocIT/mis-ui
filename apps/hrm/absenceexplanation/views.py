from django.contrib.auth.models import AnonymousUser
from django.views import View
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, SYSTEM_STATUS, ServerAPI, ApiURL
from apps.shared.msg.hrm_absence_explanation import HRMMsg


class AbsenceExplanationList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/absenceexplanation/list.html',
        menu_active='menu_absence_explanation_list',
        breadcrumb='ABSENCE_EXPLANATION_LIST_PAGE'
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AbsenceExplanationListAPI(APIView):
    @mask_view(
        login_require=True,
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        params = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.ABSENCE_EXPLANATION_LIST).get(params)
        return resp.auto_return(key_success='absence_explanation_list')

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def post(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.ABSENCE_EXPLANATION_LIST).post(request.data)
        if resp.state:
            resp.result['message'] = HRMMsg.ABSENCE_EXPLANATION_CREATE
            return resp.result, status.HTTP_201_CREATED
        return resp.auto_return()


class AbsenceExplanationCreate(View):
    @mask_view(
        auth_require=True,
        template='hrm/absenceexplanation/create.html',
        menu_active='',
        breadcrumb='ABSENCE_EXPLANATION_CREATE_PAGE',
    )
    def get(self, request, *args, **kwargs):
        employee_current = {}
        if request.user and not isinstance(request.user, AnonymousUser):
            employee_current = getattr(request.user, 'employee_current_data', {})
        ctx = {'employee_current': employee_current}
        return ctx, status.HTTP_200_OK


class AbsenceExplanationDetail(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/absenceexplanation/detail.html',
        menu_active='menu_absence_explanation_list',
        breadcrumb='ABSENCE_EXPLANATION_DETAIL_PAGE',
    )
    def get(self, request, pk, *args, **kwargs):
        return {'pk': pk}, status.HTTP_200_OK
