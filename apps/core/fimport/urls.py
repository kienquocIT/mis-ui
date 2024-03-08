from django.urls import path

from apps.core.fimport.views import FImportListView, FImportCreateView

urlpatterns = [
    path('list', FImportListView.as_view(), name='FImportListView'),
    path('create', FImportCreateView.as_view(), name='FImportCreateView'),
]
