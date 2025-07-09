from django.urls import path

from .views import (
    AttachmentUpload, FilesUnusedAPI,
    ImageWebBuilderUpload, ImageWebBuilderList, FolderList, FolderListAPI, FolderDetailAPI,
    FolderUploadFileList, AttachmentDownload, AttachmentPreview, AttachmentInfo, PublicAttachmentUpload,
    FolderListSharedAPI, FolderMyFileListAPI, AttachmentEditAPI, FolderPermListAPI, FilePermListAPI,
    AttachmentUpdateAPI
)

urlpatterns = [
    path('unused', FilesUnusedAPI.as_view(), name='FilesUnusedAPI'),
    path('upload', AttachmentUpload.as_view(), name='AttachmentUpload'),
    path('edit-api', AttachmentEditAPI.as_view(), name='AttachmentEditAPI'),
    path('update-api/<str:pk>', AttachmentUpdateAPI.as_view(), name='AttachmentUpdateAPI'),
    path('public-upload', PublicAttachmentUpload.as_view(), name='PublicAttachmentUpload'),
    path('download/<str:pk>', AttachmentDownload.as_view(), name='AttachmentDownload'),
    path('web-builder/upload', ImageWebBuilderUpload.as_view(), name='ImageWebBuilderUpload'),
    path('web-builder/list', ImageWebBuilderList.as_view(), name='ImageWebBuilderList'),
    path('file-perm-list', FilePermListAPI.as_view(), name='FilePermListAPI'),

    path('preview/<str:pk>', AttachmentPreview.as_view(), name='AttachmentPreview'),
    path('info/<str:pk>', AttachmentInfo.as_view(), name='AttachmentInfo'),

    # folder API
    path('folder/list', FolderList.as_view(), name='FolderList'),
    path('folder/api/list', FolderListAPI.as_view(), name='FolderListAPI'),
    path('folder/api/list-my-file', FolderMyFileListAPI.as_view(), name='FolderMyFileListAPI'),
    path('folder/detail-api/<str:pk>', FolderDetailAPI.as_view(), name='FolderDetailAPI'),
    path('folder-upload-file/api/list', FolderUploadFileList.as_view(), name='FolderUploadFileList'),
    path('folder-perm-list', FolderPermListAPI.as_view(), name='FolderPermListAPI'),
    # folder share with me
    path('folder/api/list-shared', FolderListSharedAPI.as_view(), name='FolderListSharedAPI'),
]
