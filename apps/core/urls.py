from django.urls import path, include
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view, TypeCheck, ServerAPI, ApiURL


class TaskBackgroundState(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        _id = kwargs.get('pk', None)
        if _id and TypeCheck.check_uuid(_id):
            resp = ServerAPI(user=request.user, url=ApiURL.TASK_BG.fill_key(pk=str(_id))).get()
            if resp.state:
                return {'task_bg': resp.result}, status.HTTP_200_OK
        return {}, status.HTTP_404_NOT_FOUND


urlpatterns = [
    path('auth/', include('apps.core.auths.urls')),
    path('account/', include('apps.core.account.urls')),
    path('hr/', include('apps.core.hr.urls')),
    path('company/', include('apps.core.company.urls')),
    path('base/', include('apps.core.base.urls')),
    path('tenant/', include('apps.core.tenant.urls')),
    path('workflow/', include('apps.core.workflow.urls')),

    path('', include('apps.core.home.urls')),  # home page
    path('task-bg/<str:pk>', TaskBackgroundState.as_view(), name='TaskBackgroundState'),
]
