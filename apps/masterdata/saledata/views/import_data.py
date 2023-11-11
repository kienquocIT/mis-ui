from django.views import View
from rest_framework import status

from apps.shared import mask_view


class SaleDataImportDataList(View):
    @mask_view(
        auth_require=True,
        template='masterdata/saledata/masterdata/import_data.html',
    )
    def get(self, request, *args, **kwargs):
        return {}, status.HTTP_200_OK

