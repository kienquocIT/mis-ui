from django.views import View
from rest_framework import status

from apps.shared import mask_view


class ShiftMasterDataList(View):
    @mask_view(
        auth_require=True,
        template='hrm/attandance/shift/shift_list.html',
        breadcrumb='MASTER_DATA_SHIFT_PAGE',
        menu_active='id_menu_master_data_shift',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK
