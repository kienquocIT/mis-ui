from django.urls import path, include
from rest_framework import status
from rest_framework.views import APIView

from apps.shared import mask_view
from apps.shared.menus import SpaceItem


class MenuFinder(APIView):
    @mask_view(login_require=True, is_api=True)
    def get(self, request, *args, **kwargs):
        ctx = {
            'menus': SpaceItem.get_menus()
        }
        return ctx, status.HTTP_200_OK


urlpatterns = [
    path('auth/', include('apps.core.auths.urls')),
    path('account/', include('apps.core.account.urls')),
    path('hr/', include('apps.core.hr.urls')),
    path('company/', include('apps.core.company.urls')),
    path('base/', include('apps.core.base.urls')),
    path('tenant/', include('apps.core.tenant.urls')),
    path('workflow/', include('apps.core.workflow.urls')),
    path('attachment/', include('apps.core.attachment.urls')),
    path('process/', include('apps.core.process.urls')),
    path('calendar/', include('apps.core.programme.urls')),
    path('comment/', include('apps.core.comment.urls')),
    path('printer/', include('apps.core.printer.urls')),
    path('mailer/', include('apps.core.mailer.urls')),
    path('import/', include('apps.core.fimport.urls')),
    path('diagram/', include('apps.core.diagram.urls')),
    path('form/', include('apps.core.form.urls')),
    path('', include('apps.core.chatbot.urls')),
    path('recurrence/', include('apps.core.recurrence.urls')),
    path('contract-template-config/', include('apps.core.contract_template.urls')),
    path('menu-finder', MenuFinder.as_view(), name='MenuFinder'),
    path('chat3rd/', include('apps.core.chat3rd.urls')),
]
