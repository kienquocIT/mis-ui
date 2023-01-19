from django.views import View
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.shared import mask_view, ConditionFormset

API_URL = {
    'user_list': 'account/users'
}

TEMPLATE = {
    'list': 'core/home/home.html',
    'detail': '',
}


class HomeView(View):
    @mask_view(
        auth_require=True,
        template='core/home/home.html',
        breadcrumb='HOME_PAGE'
    )
    def get(self, request, *args, **kwargs):
        cond_formset = ConditionFormset()
        return {"form": cond_formset}, status.HTTP_200_OK


class HomeConditionAPI(APIView):
    permission_classes = [IsAuthenticated]
    @mask_view(auth_require=True, is_api=True)
    def post(self, request, *args, **kwargs):
        form = ConditionFormset(data=request.data)
        if form.is_valid():
            rest = form.convert_and_save()
            return rest, status.HTTP_200_OK
        else:
            print(form.non_field_errors())
        return {'error': 'form is not valid!'}, status.HTTP_200_OK