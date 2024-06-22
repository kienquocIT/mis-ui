from django.urls import path

from apps.core.attachment.views import (
    AttachmentUpload, FilesUnusedAPI,
    ImageWebBuilderUpload, ImageWebBuilderList, FolderList, FolderListAPI, FolderDetailAPI,
    FolderUploadFileList,
)

urlpatterns = [
    path('unused', FilesUnusedAPI.as_view(), name='FilesUnusedAPI'),
    path('upload', AttachmentUpload.as_view(), name='AttachmentUpload'),
    path('web-builder/upload', ImageWebBuilderUpload.as_view(), name='ImageWebBuilderUpload'),
    path('web-builder/list', ImageWebBuilderList.as_view(), name='ImageWebBuilderList'),
    path('folder/list', FolderList.as_view(), name='FolderList'),
    path('folder/api/list', FolderListAPI.as_view(), name='FolderListAPI'),
    path('folder/detail-api/<str:pk>', FolderDetailAPI.as_view(), name='FolderDetailAPI'),
    path('folder-upload-file/api/list', FolderUploadFileList.as_view(), name='FolderUploadFileList'),
]
