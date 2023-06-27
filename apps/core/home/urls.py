from django.urls import path
from apps.core.home.views import (
    HomeView, ComponentCollections, TermsAndConditionsView, HelpAndSupportView, UtilitiesView,
    BookMarkListAPI, BookMarkDetailAPI,
    DocPinedListAPI, DocPinedDetailAPI,
    GatewayMiddleListView, GatewayMiddleDetailView, GatewayViewNameListView, GatewayViewNameParseView,
)

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('terms', TermsAndConditionsView.as_view(), name='TermsAndConditionsView'),
    path('help-and-support', HelpAndSupportView.as_view(), name='HelpAndSupportView'),
    path('components', ComponentCollections.as_view(), name='ComponentCollections'),
    path('utilities', UtilitiesView.as_view(), name='UtilitiesView'),

    # bookmarks
    path('bookmarks', BookMarkListAPI.as_view(), name='BookMarkListAPI'),
    path('bookmark/<str:pk>', BookMarkDetailAPI.as_view(), name='BookMarkDetailAPI'),

    # pin doc
    path('pin-docs', DocPinedListAPI.as_view(), name='DocPinedListAPI'),
    path('pin-doc/<str:pk>', DocPinedDetailAPI.as_view(), name='DocPinedDetailAPI'),

    # gateway reverse url
    path('gateway/reverse-url/views', GatewayViewNameListView.as_view(), name='GatewayViewNameListView'),
    path('gateway/reverse-url/view/<str:view_name>', GatewayViewNameParseView.as_view(), name='GatewayViewNameParseView'),
    path(
        'gateway/reverse-url/list/<str:plan>/<str:app>', GatewayMiddleListView.as_view(),
        name='GatewayMiddleListView'
    ),
    path(
        'gateway/reverse-url/detail/<str:plan>/<str:app>/<str:pk>', GatewayMiddleDetailView.as_view(),
        name='GatewayMiddleDetailView'
    ),
]
