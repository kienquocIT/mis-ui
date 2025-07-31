from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, BaseView
from apps.shared.constant import SYSTEM_STATUS


class ShiftAssignmentList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='hrm/attendance/shiftassignment/shift_assignment.html',
        menu_active='menu_shift_assignment_list',
        breadcrumb='SHIFT_ASSIGNMENT_LIST_PAGE',
        icon_cls='fas fa-user-clock',
        icon_bg='bg-pink',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class ShiftAssignmentListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return BaseView.run_list(
            request=request,
            url=ApiURL.SHIFT_ASSIGNMENT_LIST,
            key_success='shift_assignment_list'
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.SHIFT_ASSIGNMENT_LIST,
        )
