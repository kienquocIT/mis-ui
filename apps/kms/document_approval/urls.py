from django.urls import path

from .views import DocumentTypeConfigList, DocumentTypeConfigListAPI, \
    DocumentTypeConfigCreate, DocumentTypeConfigCreateAPI, DocumentTypeConfigDetail, DocumentTypeConfigDetailAPI, \
    DocumentTypeConfigEdit

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
]
