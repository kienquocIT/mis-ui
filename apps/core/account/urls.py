from django.urls import path

from apps.core.account.views import UserListAPI, UserList, UserDetailView, UserCreate

urlpatterns = [
    path('users', UserList.as_view(), name='UserList'),
    path('users/create', UserCreate.as_view(), name='UserCreate'),
    path('users/api', UserListAPI.as_view(), name='UserListAPI'),
    path('users/<str:pk>', UserDetailView.as_view(), name='UserDetailView'),
]
