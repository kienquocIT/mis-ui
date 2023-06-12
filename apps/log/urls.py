from django.urls import path, include

from apps.log.views import TicketErrorCreateAPI

urlpatterns = [
    path('ticket/create', TicketErrorCreateAPI.as_view(), name='TicketErrorCreateAPI'),
]
