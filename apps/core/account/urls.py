from django.urls import path

from apps.core.account.views import UserList, UserListAPI, UserDetailView

urlpatterns = [
    path('users', UserList.as_view(), name='UserList'),
    path('users/api', UserListAPI.as_view(), name='UserListAPI'),
    path('users/<str:pk>', UserDetailView.as_view(), name='UserDetailView'),
]
