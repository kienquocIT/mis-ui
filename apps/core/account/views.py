from django.shortcuts import render, redirect

from rest_framework.views import APIView

from apps.shared import ServerAPI, ApiURL, mask_view, AuthMsg, ServerMsg


TEMPLATE = {
    'list': 'core/account/user_list.html',
    'detail': '',
}


class UserListView(APIView):
    @mask_view(auth_require=True, template='core/account/user_list.html')
    def get(self, request, *args, **kwargs):
        response_data = ServerAPI(user=request.user, url=ApiURL.user_list).get()
        if response_data.state:
            result = response_data.result
            if result:
                return render(request, TEMPLATE.get("list"), {'user_list': result})
        else:
            raise ValueError(response_data.errors)
        return {'user_list': result}

    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        return {}
