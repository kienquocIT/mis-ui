"""system module"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from apps.shared import BreadcrumbView
from misui import media_proxy

from .jsi18n import JavaScriptCatalogCustomize

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
        path("jsi18n/<str:packages>", JavaScriptCatalogCustomize.as_view(), name="javascript-catalog"),
    ]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if not settings.USE_S3:
    urlpatterns += [
        re_path(
            r'^media/(?P<path>.*)$',
            media_proxy.MediaProxyView.as_view(),
            name='Media-Proxy'
        )
    ]

# check breadcrumb view exist and reverse successful.
BreadcrumbView.check_view_name()
