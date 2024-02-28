from django.urls import path

from apps.core.mailer.views import MailTemplatesListView

urlpatterns = [
    path('list', MailTemplatesListView.as_view(), name='MailTemplatesListView'),
]
