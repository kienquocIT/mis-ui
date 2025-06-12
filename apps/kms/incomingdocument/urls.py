from django.urls import path

from apps.kms.incomingdocument.views import IncomingDocumentCreate

urlpatterns = [  # config
    path('incoming-document/create', IncomingDocumentCreate.as_view(), name='IncomingDocumentCreate'),
]
