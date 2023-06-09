from django.views import View
from rest_framework import status

from apps.shared import mask_view, ServerAPI


class DefaultDataView(View):
    @mask_view(
        auth_require=True,
        template='shareapp/default_data.html',
    )
    def get(self, request, *args, **kwargs):
        data_list = ServerAPI(user=request.user, url='private-system/default-data').get()
        result = []
        for plan, plan_data in data_list.result.items():
            for feature, feature_data in plan_data.items():
                row = []
                data_tmp = []
                for data in feature_data:
                    row_tmp = []
                    arr_tmp = []
                    for key in data.keys():
                        row_tmp.append(key)
                        arr_tmp.append(data[key])
                    if not row:
                        row = row_tmp
                    data_tmp.append(arr_tmp)
                result.append(
                    {
                        'plan': plan,
                        'feature': feature,
                        'rows': row,
                        'data': data_tmp,
                    }
                )
        return {'default_data': result}, status.HTTP_200_OK
