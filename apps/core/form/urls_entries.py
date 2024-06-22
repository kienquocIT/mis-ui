from django.urls import path

from apps.core.form.views_entries import FormEntriesListView, FormEntriesListAPI, FormEntriesRefNameListAPI

urlpatterns = [
    path('<str:pk>/list', FormEntriesListView.as_view(), name='FormEntriesListView'),
    path('<str:pk>/list/api', FormEntriesListAPI.as_view(), name='FormEntriesListAPI'),
    path('<str:pk>/ref-name/api', FormEntriesRefNameListAPI.as_view(), name='FormEntriesRefNameListAPI'),
]
