from django.views import View
from rest_framework import status

from apps.shared import mask_view, ServerAPI, ApiURL

__all__ = ['ProgrammeList']


class ProgrammeList(View):
    @mask_view(
        auth_require=True,
        template='programme/calendar-list.html',
        breadcrumb='CALENDAR_LIST_PAGE',
        menu_active='menu_calendar',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(user=request.user, url=ApiURL.WORKING_CALENDAR_CONFIG).get()
        res_ws = {}
        if resp.state:
            res_ws = resp.result
        return {'working_shift': res_ws}, status.HTTP_200_OK
