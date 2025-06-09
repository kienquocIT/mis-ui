from django.urls import path

from .views import (
    AttachmentUpload, FilesUnusedAPI,
    ImageWebBuilderUpload, ImageWebBuilderList, FolderList, FolderListAPI, FolderDetailAPI,
    FolderUploadFileList, AttachmentDownload, AttachmentPreview, AttachmentInfo, FolderListSharedAPI,
)

urlpatterns = [
    path('unused', FilesUnusedAPI.as_view(), name='FilesUnusedAPI'),
    path('upload', AttachmentUpload.as_view(), name='AttachmentUpload'),
    path('download/<str:pk>', AttachmentDownload.as_view(), name='AttachmentDownload'),
    path('web-builder/upload', ImageWebBuilderUpload.as_view(), name='ImageWebBuilderUpload'),
    path('web-builder/list', ImageWebBuilderList.as_view(), name='ImageWebBuilderList'),
    path('folder/list', FolderList.as_view(), name='FolderList'),
    path('folder/api/list', FolderListAPI.as_view(), name='FolderListAPI'),
    path('folder/api/list-shared', FolderListSharedAPI.as_view(), name='FolderListSharedAPI'),
    path('folder/detail-api/<str:pk>', FolderDetailAPI.as_view(), name='FolderDetailAPI'),
    path('folder-upload-file/api/list', FolderUploadFileList.as_view(), name='FolderUploadFileList'),

    path('preview/<str:pk>', AttachmentPreview.as_view(), name='AttachmentPreview'),
    path('info/<str:pk>', AttachmentInfo.as_view(), name='AttachmentInfo'),
]
