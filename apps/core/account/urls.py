from django.urls import path

from apps.core.account.views import UserListView

urlpatterns = [
    path('users', UserListView.as_view(), name='UserListView'),
]
