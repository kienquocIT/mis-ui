from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ApiURL, ServerAPI


class OpportunityDDListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return {'opportunity_list': [
            {
                'id': '1',
                'title': 'Project 1',
                'code': '1'
            },
            {
                'id': '2',
                'title': 'Project 2',
                'code': '2'
            },
            {
                'id': '3',
                'title': 'Project 3',
                'code': '3'
            }
        ]}, status.HTTP_200_OK
