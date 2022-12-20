from django.urls import path

from apps.core.account.views import UserListView, UserDetailView

urlpatterns = [
    path('users', UserListView.as_view(), name='UserListView'),
    path('users/<str:pk>', UserDetailView.as_view(), name='UserDetailView'),
]
