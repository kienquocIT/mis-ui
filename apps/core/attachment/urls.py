from django.urls import path

from apps.core.attachment.views import AttachmentUpload

urlpatterns = [
    path('upload', AttachmentUpload.as_view(), name='AttachmentUpload'),
]
