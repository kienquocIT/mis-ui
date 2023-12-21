from django.urls import path

from apps.core.attachment.views import AttachmentUpload, FilesUnusedAPI

urlpatterns = [
    path('unused', FilesUnusedAPI.as_view(), name='FilesUnusedAPI'),
    path('upload', AttachmentUpload.as_view(), name='AttachmentUpload'),
]
