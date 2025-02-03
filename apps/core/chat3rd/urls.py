from django.urls import path

from apps.core.chat3rd.views import *

urlpatterns = [
    path('list', Chat3rdView.as_view(), name='Chat3rdView'),
]

urlpatterns += [
    path('messenger/limit', ChatMessengerLimitAPI.as_view(), name='ChatMessengerLimitAPI'),
    path('messenger/connected', MessengerConnected.as_view(), name='MessengerConnected'),
    path('messenger/connected/api', MessengerConnectedAPI.as_view(), name='MessengerConnectedAPI'),
    path('messenger/parent/<str:pk>/accounts-sync', MessengerAccountSyncAPI.as_view(), name='MessengerAccountSyncAPI'),
    path('messenger/persons/page/<str:page_id>', MessengerPersonAPI.as_view(), name='MessengerPersonAPI'),
    path(
        'messenger/persons/page/<str:page_id>/<str:person_id>/chats', MessengerPersonChatAPI.as_view(),
        name='MessengerPersonChatAPI'
    ),
    path('messenger/config', MessengerConfigView.as_view(), name='MessengerConfigView'),

    path(
        'messenger/person/<str:pk>/contact', MessengerPersonDetailContactAPI.as_view(),
        name='MessengerPersonDetailContactAPI'
    ),
    path('messenger/person/<str:pk>/lead', MessengerPersonDetailLeadAPI.as_view(), name='MessengerPersonDetailLeadAPI'),
]

urlpatterns += [
    path('zalo/connected', ZaloConnected.as_view(), name='ZaloConnected'),
    path('zalo/connected/api', ZaloConnectedAPI.as_view(), name='ZaloConnectedAPI'),
]
