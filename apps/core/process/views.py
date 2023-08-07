from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL


class SaleProcess(View):
    @mask_view(
        auth_require=True,
        template='core/process/sale_process.html',
        menu_active='menu_sale_process',
        breadcrumb='',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK


class FunctionProcessListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url=ApiURL.FUNCTION_PROCESS_LIST).get()
        return resp.auto_return(key_success='function_list')

