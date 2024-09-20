from django.urls import path

from apps.log.views import (
    TicketErrorCreateAPI,
    ActivityLogListAPI,
    MyNotifyNoDoneCountAPI,
    MyNotifySeenAllAPI,
    MyNotifyAllAPI,
    MyNotifyCleanAllAPI, MyNotifyPageView,
    MailLogView, MailLogAPI,
)

urlpatterns = [
    path('ticket/create', TicketErrorCreateAPI.as_view(), name='TicketErrorCreateAPI'),
    path('activities', ActivityLogListAPI.as_view(), name='ActivityLogListAPI'),
    path('notifications', MyNotifyPageView.as_view(), name='MyNotifyPageView'),
    path('notify/me/all', MyNotifyAllAPI.as_view(), name='MyNotifyAllAPI'),
    path('notify/me/count', MyNotifyNoDoneCountAPI.as_view(), name='MyNotifyNoDoneCountAPI'),
    path('notify/me/seen-all', MyNotifySeenAllAPI.as_view(), name='MyNotifySeenAllAPI'),
    path('notify/me/clean-all', MyNotifyCleanAllAPI.as_view(), name='MyNotifyCleanAllAPI'),

    path('mail', MailLogView.as_view(), name='MailLogView'),
    path('mail/api', MailLogAPI.as_view(), name='MailLogAPI'),
]
