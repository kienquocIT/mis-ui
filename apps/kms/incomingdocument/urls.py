from django.urls import path

from apps.core.attachment.views import FolderListAPI
from apps.kms.document_approval.views import ContentGroupListAPI, DocumentTypeConfigListAPI
from apps.kms.incomingdocument.views import IncomingDocumentCreate

urlpatterns = [  # config
    path('incoming-document/create', IncomingDocumentCreate.as_view(), name='IncomingDocumentCreate'),
    path('config/content-group/list-api', ContentGroupListAPI.as_view(), name='ContentGroupListAPI'),
    path('config/document-type/list-api', DocumentTypeConfigListAPI.as_view(), name='DocumentTypeConfigListAPI'),
]
