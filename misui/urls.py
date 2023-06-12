"""system module"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.i18n import JavaScriptCatalog
from django.conf.urls.i18n import i18n_patterns
from apps.shared import BreadcrumbView

urlpatterns = \
    [
        path('system-admin/', admin.site.urls),
        path('', include('apps.core.urls')),
        path('', include('apps.masterdata.urls')),
        path('private-system/', include('apps.sharedapp.urls')),
        path('', include('apps.sales.urls')),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += i18n_patterns(
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
)

# check breadcrumb view exist and reverse successful.
BreadcrumbView.check_view_name()
