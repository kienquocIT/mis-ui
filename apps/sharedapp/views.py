from django.views import View
from rest_framework import status

from apps.shared import mask_view, ServerAPI


class DefaultDataView(View):
    @classmethod
    def callback_success(cls, result):
        rs = []
        for plan, plan_data in result.items():
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
                rs.append(
                    {
                        'plan': plan,
                        'feature': feature,
                        'rows': row,
                        'data': data_tmp,
                    }
                )
        return {'default_data': rs}

    @mask_view(
        auth_require=True,
        template='shareapp/default_data.html',
    )
    def get(self, request, *args, **kwargs):
        resp = ServerAPI(request=request, user=request.user, url='private-system/default-data').get()
        return resp.auto_return(callback_success=self.callback_success)
