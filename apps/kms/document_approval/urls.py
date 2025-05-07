from django.urls import path

from .views import DocumentTypeConfigList, DocumentTypeConfigListAPI, \
    DocumentTypeConfigCreate, DocumentTypeConfigCreateAPI, DocumentTypeConfigDetail, DocumentTypeConfigDetailAPI, \
    DocumentTypeConfigEdit, ContentGroupList, ContentGroupListAPI, ContentGroupCreate, ContentGroupCreateAPI, \
    ContentGroupDetailAPI, ContentGroupEdit, ContentGroupDetail, KMSDocumentApprovalList, KMSDocumentApprovalListAPI, \
    KMSDocumentApprovalCreate, KMSDocumentApprovalCreateAPI, KMSDocumentApprovalDetail, KMSDocumentApprovalDetailAPI, \
    KMSDocumentApprovalEdit

urlpatterns = [
    path('config/document-type/list', DocumentTypeConfigList.as_view(), name='DocumentTypeConfigList'),
    path('config/document-type/list-api', DocumentTypeConfigListAPI.as_view(), name='DocumentTypeConfigListAPI'),
    path('config/document-type/create', DocumentTypeConfigCreate.as_view(), name='DocumentTypeConfigCreate'),
    path('config/document-type/create-api', DocumentTypeConfigCreateAPI.as_view(), name='DocumentTypeConfigCreateAPI'),
    path('config/document-type/detail/<str:pk>', DocumentTypeConfigDetail.as_view(), name='DocumentTypeConfigDetail'),
    path(
        'config/document-type/detail-api/<str:pk>', DocumentTypeConfigDetailAPI.as_view(),
        name='DocumentTypeConfigDetailAPI'
    ),
    path('config/document-type/edit/<str:pk>', DocumentTypeConfigEdit.as_view(), name='DocumentTypeConfigEdit'),
    #  content group
    path('config/content-group/list', ContentGroupList.as_view(), name='ContentGroupList'),
    path('config/content-group/list-api', ContentGroupListAPI.as_view(), name='ContentGroupListAPI'),
    path('config/content-group/create', ContentGroupCreate.as_view(), name='ContentGroupCreate'),
    path('config/content-group/create-api', ContentGroupCreateAPI.as_view(), name='ContentGroupCreateAPI'),
    path('config/content-group/detail/<str:pk>', ContentGroupDetail.as_view(), name='ContentGroupDetail'),
    path('config/content-group/detail-api/<str:pk>', ContentGroupDetailAPI.as_view(), name='ContentGroupDetailAPI'),
    path('config/content-group/edit/<str:pk>', ContentGroupEdit.as_view(), name='ContentGroupEdit'),

    # document approval
    path('document-approval/list', KMSDocumentApprovalList.as_view(), name='KMSDocumentApprovalList'),
    path('document-approval/list-api', KMSDocumentApprovalListAPI.as_view(), name='KMSDocumentApprovalListAPI'),
    path('document-approval/create', KMSDocumentApprovalCreate.as_view(), name='KMSDocumentApprovalCreate'),
    path('document-approval/create-api', KMSDocumentApprovalCreateAPI.as_view(), name='KMSDocumentApprovalCreateAPI'),
    path('document-approval/detail/<str:pk>', KMSDocumentApprovalDetail.as_view(), name='KMSDocumentApprovalDetail'),
    path(
        'document-approval/detail-api/<str:pk>', KMSDocumentApprovalDetailAPI.as_view(),
        name='KMSDocumentApprovalDetailAPI'
    ),
    path('document-approval/edit/<str:pk>', KMSDocumentApprovalEdit.as_view(), name='KMSDocumentApprovalEdit'),
    path(
        'document-approval/edit-api/<str:pk>', KMSDocumentApprovalDetailAPI.as_view(),
        name='KMSDocumentApprovalEditAPI'
    ),
]
