from django.views import View
from rest_framework import status

from apps.shared import mask_view, ServerAPI, ApiURL


class MailTemplatesListView(View):
    @mask_view(
        login_require=True,
        auth_require=True,
        template='mailer/list.html',
        breadcrumb='MAILER_CONFIG_LIST_PAGE',
        menu_active='menu_mail_template',
    )
    def get(self, request, *args, **kwargs):
        # templates_apps_list = ServerAPI(request=request, user=request.user, url=ApiURL.PRINT_TEMPLATES_APPS_LIST).get(
        #     data={
        #         'pageSize': -1,  # full records
        #     }
        # )
        # if templates_apps_list.state:
        #     ctx = {
        #         'templates_apps_list': templates_apps_list.result,
        #     }
        #     return ctx, status.HTTP_200_OK
        # return {}, status.HTTP_404_NOT_FOUND
        return {}, status.HTTP_200_OK
