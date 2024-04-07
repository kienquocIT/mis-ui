from django.urls import path

from apps.core.mailer.views.system import MailTemplateSystemAPI, MailTemplateSystemDetailAPI
from apps.core.mailer.views.base import (
    ApplicationPropertyForMailListAPI,
    MailApplicationTemplateSample,
)
from apps.core.mailer.views.config import (
    MailTemplatesListView, MailTemplateCreateView, MailTemplateDetailView,
    MailTemplateUpdateView, MailTemplateListAPI, MailTemplateDetailAPI,
    MailConfigAPI, MailConfigDetailAPI, MailConfigConnectionTest, MailConfigConnectionTestData, MailFeatureAppListAPI,
    MailTemplateListByApplicationAPI,
)

urlpatterns = [
    path('system/get/<str:system_code>', MailTemplateSystemAPI.as_view(), name='MailTemplateSystemAPI'),
    path('system/detail/<str:pk>', MailTemplateSystemDetailAPI.as_view(), name='MailTemplateSystemDetailAPI'),

    path('params', ApplicationPropertyForMailListAPI.as_view(), name='ApplicationPropertyForMailListAPI'),
    path('templates/<str:app_id>', MailApplicationTemplateSample.as_view(), name='MailApplicationTemplateSample'),

    path('config/get', MailConfigAPI.as_view(), name='MailConfigAPI'),
    path('config/detail/<str:pk>', MailConfigDetailAPI.as_view(), name='MailConfigDetailAPI'),
    path('config/detail/<str:pk>/connection-test', MailConfigConnectionTest.as_view(), name='MailConfigConnectionTest'),
    path(
        'config/detail/<str:pk>/connection-test-data', MailConfigConnectionTestData.as_view(),
        name='MailConfigConnectionTestData'
    ),

    path('feature/app/list', MailFeatureAppListAPI.as_view(), name='MailFeatureAppListAPI'),
    path('feature/list/api', MailTemplateListAPI.as_view(), name='MailTemplateListAPI'),
    path(
        'feature/list/<str:application_id>/api', MailTemplateListByApplicationAPI.as_view(),
        name='MailTemplateListByApplicationAPI'
    ),
    path('feature/detail/<str:pk>', MailTemplateDetailView.as_view(), name='MailTemplateDetailView'),
    path('feature/detail/<str:pk>/api', MailTemplateDetailAPI.as_view(), name='MailTemplateDetailAPI'),
    path('feature/update/<str:pk>', MailTemplateUpdateView.as_view(), name='MailTemplateUpdateView'),

    path('list', MailTemplatesListView.as_view(), name='MailTemplatesListView'),
    path('create', MailTemplateCreateView.as_view(), name='MailTemplateCreateView'),

]
