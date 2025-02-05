"""system module"""
import os

from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from apps.shared import BreadcrumbView
from misui import media_proxy

from .jsi18n import JavaScriptCatalogCustomize


def showFirebaseJS(request):
    data = """
        importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
        importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');
        importScripts('/static/firebase/handle_message.js');
    """ + f"""
        firebase.initializeApp({os.getenv("FCM_CONFIG", "")});
    """ + """
        const messaging = firebase.messaging();
        messaging.onBackgroundMessage(function(payload) {
            console.log('[firebase-messaging-sw.js] Received background message ', payload);
            fcm_handle_message(payload, 'background');
        });
        self.addEventListener("notificationclick", (event) => {
          event.notification.close();
          event.waitUntil(
            clients
              .matchAll({
                type: "window",
              })
              .then((clientList) => {
                for (const client of clientList) {
                  if (client.url === "/" && "focus" in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow("/");
              }),
          );
        });
    """

    return HttpResponse(data, content_type="text/javascript")


urlpatterns = \
    [
        path('django-admin/', admin.site.urls),
        path('', include('apps.core.home.urls')),
        path('', include('apps.core.urls')),
        path('', include('apps.masterdata.urls')),
        path('', include('apps.sales.urls')),
        path('', include('apps.accounting.urls')),
        path('', include('apps.eoffice.urls')),
        path('hrm/', include('apps.hrm.urls')),
        path('site/', include('apps.web_builder.urls.viewer')),
        path('site-config/', include('apps.web_builder.urls.config')),
        path("jsi18n/<str:packages>", JavaScriptCatalogCustomize.as_view(), name="javascript-catalog"),
        path('firebase-messaging-sw.js', showFirebaseJS, name="show_firebase_js"),
    ]

urlpatterns += static('django-admin-media/', document_root=settings.MEDIA_ROOT)

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

handler404 = 'apps.core.home.views.view_render_not_found'
