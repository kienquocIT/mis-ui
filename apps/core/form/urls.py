from django.urls import path, include

from apps.core.form.views import (
    FormListView, FormCreateView, FormListAPI, FormCreateAPI, FormUpdateView,
    FormUpdateAPI, FormDetailAPI,
    FormSanitizeHTMLAPI, FormDetailForEntriesAPI, FormUpdateTurnOnOffAPI, FakePreviewIframe, FormDetailDuplicateAPI,
    FormKnowledgeView, FormAuthLogView, FormMailLogAPI,
)

urlpatterns = [
    # util
    path('sanitize-html', FormSanitizeHTMLAPI.as_view(), name='FormSanitizeHTMLAPI'),

    # config
    path('config/list', FormListView.as_view(), name='FormListView'),
    path('config/list/api', FormListAPI.as_view(), name='FormListAPI'),
    path('config/create', FormCreateView.as_view(), name='FormCreateView'),
    path('config/create/api', FormCreateAPI.as_view(), name='FormCreateAPI'),
    path('config/detail/<str:pk>/api', FormDetailAPI.as_view(), name='FormDetailAPI'),
    path('config/detail/<str:pk>/duplicate/api', FormDetailDuplicateAPI.as_view(), name='FormDetailDuplicateAPI'),
    path('config/detail/<str:pk>/for-entries/api', FormDetailForEntriesAPI.as_view(), name='FormDetailForEntriesAPI'),
    path('config/update/<str:pk>', FormUpdateView.as_view(), name='FormUpdateView'),
    path('config/update/<str:pk>/api', FormUpdateAPI.as_view(), name='FormUpdateAPI'),
    path('config/update/<str:pk>/turn-off/api', FormUpdateTurnOnOffAPI.as_view(), name='FormUpdateTurnOnOffAPI'),
    path('config/knowledge', FormKnowledgeView.as_view(), name='FormKnowledgeView'),

    # log
    path('mail-log', FormAuthLogView.as_view(), name='FormAuthLogView'),
    path('mail-log/api', FormMailLogAPI.as_view(), name='FormMailLogAPI'),

    # another
    path('publised/', include('apps.core.form.urls_published')),
    path('entries/', include('apps.core.form.urls_entries')),
    path('r/', include('apps.core.form.urls_runtime')),

    # fake iframe preview
    path('iframe/fake/preview/<str:form_code>', FakePreviewIframe.as_view(), name='FakePreviewIframe'),
]
