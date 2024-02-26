from django.urls import path

from apps.core.extends.views import (
    PrintTemplatesListAPI, PrintTemplatesListView, PrintTemplateUsingDetail,
    PrintTemplateCreateView, PrintTemplateCreateAPI, PrintTemplateDetailView, PrintTemplateDetailAPI,
    PrintTemplateUpdateView, PrintTemplateApplicationListAPI, PrintApplicationTemplateSample,
)

urlpatterns = [
    path('apps', PrintTemplateApplicationListAPI.as_view(), name='PrintTemplateApplicationListAPI'),
    path('templates/<str:app_id>', PrintApplicationTemplateSample.as_view(), name='PrintApplicationTemplateSample'),
    path('list/api', PrintTemplatesListAPI.as_view(), name='PrintTemplatesListAPI'),
    path('list', PrintTemplatesListView.as_view(), name='PrintTemplatesListView'),
    path('create', PrintTemplateCreateView.as_view(), name='PrintTemplateCreateView'),
    path('create/api', PrintTemplateCreateAPI.as_view(), name='PrintTemplateCreateAPI'),
    path('detail/<str:pk>', PrintTemplateDetailView.as_view(), name='PrintTemplateDetailView'),
    path('detail/<str:pk>/api', PrintTemplateDetailAPI.as_view(), name='PrintTemplateDetailAPI'),
    path('update/<str:pk>', PrintTemplateUpdateView.as_view(), name='PrintTemplateUpdateView'),

    path('using/<str:application_id>', PrintTemplateUsingDetail.as_view(), name='PrintTemplateUsingDetail'),
]
