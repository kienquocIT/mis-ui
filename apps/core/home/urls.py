from django.conf import settings
from django.urls import path
from apps.core.home.views import (
    HomeView, NotFoundView, ServerMaintainView, LandingPageView,
    ComponentCollections, TermsAndConditionsView, HelpAndSupportView, UtilitiesView,
    BookMarkListAPI, BookMarkDetailAPI,
    DocPinedListAPI, DocPinedDetailAPI,
    GatewayMiddleListView, GatewayMiddleDetailView, GatewayViewNameListView, GatewayViewNameParseView, DefaultDataView,
    OutLayoutNotFoundView, OutLayoutServerOff,
)

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('p-404', OutLayoutNotFoundView.as_view(), name='OutLayoutNotFoundView'),
    path('p-503', OutLayoutServerOff.as_view(), name='OutLayoutServerOff'),
    path('404', NotFoundView.as_view(), name='NotFoundView'),
    path('503', ServerMaintainView.as_view(), name='ServerMaintainView'),
    path('introduce', LandingPageView.as_view(), name='LandingPageView'),
    path('terms', TermsAndConditionsView.as_view(), name='TermsAndConditionsView'),
    path('help-and-support', HelpAndSupportView.as_view(), name='HelpAndSupportView'),

    # bookmarks
    path('bookmarks', BookMarkListAPI.as_view(), name='BookMarkListAPI'),
    path('bookmark/<str:pk>', BookMarkDetailAPI.as_view(), name='BookMarkDetailAPI'),

    # pin doc
    path('pin-docs', DocPinedListAPI.as_view(), name='DocPinedListAPI'),
    path('pin-doc/<str:pk>', DocPinedDetailAPI.as_view(), name='DocPinedDetailAPI'),

    # gateway reverse url
    path('gateway/reverse-url/views', GatewayViewNameListView.as_view(), name='GatewayViewNameListView'),
    path(
        'gateway/reverse-url/view/<str:view_name>', GatewayViewNameParseView.as_view(), name='GatewayViewNameParseView'
    ),
    path(
        'gateway/reverse-url/list/<str:plan>/<str:app>', GatewayMiddleListView.as_view(),
        name='GatewayMiddleListView'
    ),
    path(
        'gateway/reverse-url/detail/<str:plan>/<str:app>/<str:pk>', GatewayMiddleDetailView.as_view(),
        name='GatewayMiddleDetailView'
    ),
]

if settings.DEBUG is True:
    urlpatterns += [
        path('components', ComponentCollections.as_view(), name='ComponentCollections'),
        path('utilities', UtilitiesView.as_view(), name='UtilitiesView'),
        path('default-data', DefaultDataView.as_view(), name='DefaultDataView'),
    ]
