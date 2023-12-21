from django.views import View
from rest_framework import status

from apps.shared import mask_view

__all__ = ['ProgrammeList']


class ProgrammeList(View):
    @mask_view(
        auth_require=True,
        template='programme/calendar-list.html',
        breadcrumb='CALENDAR_LIST_PAGE',
        menu_active='menu_calendar',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
