from django.urls import path

from apps.core.attachment.views import (
    AttachmentUpload, FilesUnusedAPI,
    ImageWebBuilderUpload, ImageWebBuilderList,
)

urlpatterns = [
    path('unused', FilesUnusedAPI.as_view(), name='FilesUnusedAPI'),
    path('upload', AttachmentUpload.as_view(), name='AttachmentUpload'),
    path('web-builder/upload', ImageWebBuilderUpload.as_view(), name='ImageWebBuilderUpload'),
    path('web-builder/list', ImageWebBuilderList.as_view(), name='ImageWebBuilderList'),
]
