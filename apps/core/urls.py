from django.urls import path, include

urlpatterns = [
    path('auth/', include('apps.core.auths.urls')),
    path('account/', include('apps.core.account.urls')),
    path('hr/', include('apps.core.hr.urls')),
    path('company/', include('apps.core.company.urls')),
    path('base/', include('apps.core.base.urls')),
    path('tenant/', include('apps.core.tenant.urls')),
    path('workflow/', include('apps.core.workflow.urls')),
    path('attachment/', include('apps.core.attachment.urls')),
    path('sale-process/', include('apps.core.process.urls')),
    path('calendar/', include('apps.core.programme.urls')),
    path('comment/', include('apps.core.comment.urls')),
    path('printer/', include('apps.core.printer.urls')),
    path('mailer/', include('apps.core.mailer.urls')),
    path('import/', include('apps.core.fimport.urls')),
]
