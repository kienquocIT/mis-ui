from rest_framework.views import APIView

from apps.shared import mask_view


class UserListView(APIView):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        # resp_data = ServerAPI(user=request.user, url=ApiURL.user_list).get()
        # if resp_data.state:
        #     result = resp_data.result['result']
        #     return render(request, template, {})
        # else:
        #     raise ValueError(resp_data.errors)
        user_list = ['abc']
        return {'user_list': user_list}

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        return {}
