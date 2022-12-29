from django.urls import path

from apps.core.account.views import UserListAPI, UserList, UserDetailAPI, UserCreate

urlpatterns = [
    path('users', UserList.as_view(), name='UserList'),
    path('users/create', UserCreate.as_view(), name='UserCreate'),
    path('users/api', UserListAPI.as_view(), name='UserListAPI'),
    path('users/<str:pk>', UserDetailAPI.as_view(), name='UserDetailAPI'),
]
