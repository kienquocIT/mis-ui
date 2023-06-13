from django.urls import path

from apps.log.views import (
    TicketErrorCreateAPI,
    ActivityLogListAPI,
)

urlpatterns = [
    path('ticket/create', TicketErrorCreateAPI.as_view(), name='TicketErrorCreateAPI'),
    path('activities', ActivityLogListAPI.as_view(), name='ActivityLogListAPI'),
]
