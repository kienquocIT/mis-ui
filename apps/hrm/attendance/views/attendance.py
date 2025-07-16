from django.views import View
from rest_framework import status

from apps.shared import mask_view


class HRMAttendanceList(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='hrm/attendance/attendance/attendance_list.html',
        breadcrumb='HRM_ATTENDANCE_LIST_PAGE',
        menu_active='menu_attendance_list',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
