from django.urls import path

from apps.core.account.views import UserListAPI, UserList, UserDetailAPI, UserCreate, UserDetail, \
    UserEdit

urlpatterns = [
    path('users', UserList.as_view(), name='UserList'),
    path('users/create', UserCreate.as_view(), name='UserCreate'),
    path('user/detail/<str:pk>', UserDetail.as_view(), name='UserDetail'),
    path('user/edit/<str:pk>', UserEdit.as_view(), name='UserEdit'),
    path('users/api', UserListAPI.as_view(), name='UserListAPI'),
    path('user/detail/<str:pk>/api', UserDetailAPI.as_view(), name='UserDetailAPI'),
]
