from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.shared import mask_view, ServerAPI, ApiURL, BaseView
from apps.shared.constant import SYSTEM_STATUS


class AttributeList(View):
    permission_classes = [IsAuthenticated]

    @mask_view(
        auth_require=True,
        template='masterdata/saledata/attribute/attribute_list.html',
        menu_active='menu_attendance_device_list',
        breadcrumb='ATTENDANCE_DEVICE_LIST_PAGE',
        icon_cls='fa-solid fa-gears',
        icon_bg='bg-smoke',
    )
    def get(self, request, *args, **kwargs):
        return {'stt_sys': SYSTEM_STATUS}, status.HTTP_200_OK


class AttributeListAPI(APIView):
    @mask_view(
        auth_require=True,
        is_api=True,
    )
    def get(self, request, *args, **kwargs):
        return BaseView.run_list(
            request=request,
            url=ApiURL.ATTENDANCE_DEVICE_LIST,
            key_success='attendance_device_list'
        )

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def post(self, request, *args, **kwargs):
        return BaseView.run_create(
            request=request,
            url=ApiURL.ATTENDANCE_DEVICE_LIST,
        )


class AttributeDetailAPI(APIView):

    @mask_view(
        auth_require=True,
        is_api=True
    )
    def put(self, request, *args, pk, **kwargs):
        return BaseView.run_update(
            request=request,
            url=ApiURL.ATTENDANCE_DEVICE_DETAIL,
            pk=pk,
        )