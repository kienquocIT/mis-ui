from django.views import View
from rest_framework import status

from apps.shared import mask_view, LEAD_STATUS


class Chat3rdView(View):
    @mask_view(
        login_require=True,
        is_api=False,
        template='chat3rd/list.html',
        jsi18n='chat3rd',
    )
    def get(self, request, *args, **kwargs):
        return [{
            'lead_status': LEAD_STATUS,
        }, status.HTTP_200_OK]
