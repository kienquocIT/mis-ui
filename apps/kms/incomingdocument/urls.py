from django.urls import path

from apps.core.attachment.views import FolderListAPI
from apps.kms.document_approval.views import ContentGroupListAPI, DocumentTypeConfigListAPI
from apps.kms.incomingdocument.views import IncomingDocumentCreate, IncomingDocumentListAPI, IncomingDocumentDetail, \
    IncomingDocumentEdit, IncomingDocumentDetailAPI, IncomingDocumentList

urlpatterns = [
    # incoming document
    path('incoming-document/create', IncomingDocumentCreate.as_view(), name='IncomingDocumentCreate'),
    path('config/content-group/list-api', ContentGroupListAPI.as_view(), name='ContentGroupListAPI'),
    path('config/document-type/list-api', DocumentTypeConfigListAPI.as_view(), name='DocumentTypeConfigListAPI'),
    path('incoming-document/list', IncomingDocumentList.as_view(), name='IncomingDocumentList'),
    path('incoming-document/list-api', IncomingDocumentListAPI.as_view(), name='IncomingDocumentListAPI'),
    path('incoming-document/detail/<str:pk>', IncomingDocumentDetail.as_view(), name='IncomingDocumentDetail'),
    path(
        'incoming-document/detail-api/<str:pk>', IncomingDocumentDetailAPI.as_view(),
        name='IncomingDocumentDetailAPI'
    ),
    path('incoming-document/update/<str:pk>', IncomingDocumentEdit.as_view(), name='IncomingDocumentEdit'),
]
