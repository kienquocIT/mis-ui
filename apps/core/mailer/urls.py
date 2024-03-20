from django.urls import path

from apps.core.mailer.views.system import MailTemplateSystemAPI, MailTemplateSystemDetailAPI
from apps.core.mailer.views.base import (
    ApplicationPropertyForMailListAPI,
    MailApplicationTemplateSample,
)
from apps.core.mailer.views.config import (
    MailTemplatesListView, MailTemplateCreateView, MailTemplateDetailView,
    MailTemplateUpdateView, MailTemplateListAPI, MailTemplateDetailAPI,
)

urlpatterns = [
    path('system/get/<str:system_code>', MailTemplateSystemAPI.as_view(), name='MailTemplateSystemAPI'),
    path('system/detail/<str:pk>', MailTemplateSystemDetailAPI.as_view(), name='MailTemplateSystemDetailAPI'),

    path('params', ApplicationPropertyForMailListAPI.as_view(), name='ApplicationPropertyForMailListAPI'),
    path('templates/<str:app_id>', MailApplicationTemplateSample.as_view(), name='MailApplicationTemplateSample'),

    path('list', MailTemplatesListView.as_view(), name='MailTemplatesListView'),
    path('create', MailTemplateCreateView.as_view(), name='MailTemplateCreateView'),
    path('api/list', MailTemplateListAPI.as_view(), name='MailTemplateListAPI'),
    path('api/detail/<str:pk>', MailTemplateDetailAPI.as_view(), name='MailTemplateDetailAPI'),
    path('detail/<str:pk>', MailTemplateDetailView.as_view(), name='MailTemplateDetailView'),
    path('update/<str:pk>', MailTemplateUpdateView.as_view(), name='MailTemplateUpdateView'),
]
