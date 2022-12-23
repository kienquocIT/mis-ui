from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.i18n import JavaScriptCatalog
from django.conf.urls.i18n import i18n_patterns
from apps.shared import BreadcrumbView

urlpatterns = \
    [
        path('admin/', admin.site.urls),
        path('', include('apps.core.urls')),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += i18n_patterns(
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
)

# check breadcrumb view exist and reverse successful.
BreadcrumbView.check_view_name()
