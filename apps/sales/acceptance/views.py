from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ServerAPI, ApiURL


# FINAL ACCEPTANCE
class FinalAcceptanceList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='sales/acceptance/final_acceptance.html',
        menu_active='',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FinalAcceptanceListAPI(APIView):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        data = request.query_params.dict()
        resp = ServerAPI(user=request.user, url=ApiURL.FINAL_ACCEPTANCE_LIST).get(data)
        return resp.auto_return(key_success='final_acceptance_list')
