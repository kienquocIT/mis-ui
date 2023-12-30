"""system module"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.i18n import JavaScriptCatalog
from django.views.generic.base import RedirectView
from django.conf.urls.i18n import i18n_patterns
from apps.shared import BreadcrumbView

urlpatterns = \
    [
        path('system-admin/', admin.site.urls),
        path('', include('apps.core.home.urls')),
        path('', include('apps.core.urls')),
        path('', include('apps.masterdata.urls')),
        path('', include('apps.sales.urls')),
        path('', include('apps.eoffice.urls')),
        path('site/', include('apps.web_builder.urls.viewer')),
        path('site-config/', include('apps.web_builder.urls.config')),
    ]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += i18n_patterns(
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
)

urlpatterns += [
    re_path(
        r'^media/(?P<path>.*)$',
        RedirectView.as_view(url=f'{settings.API_DOMAIN_SIMPLE}/media/%(path)s', permanent=True)
    ),
]

# check breadcrumb view exist and reverse successful.
BreadcrumbView.check_view_name()
