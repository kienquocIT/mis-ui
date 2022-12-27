from django.urls import path

from apps.core.account.views import UserListView, UserList, UserDetailView

urlpatterns = [
    path('users', UserList.as_view(), name='UserList'),
    path('users/api', UserListView.as_view(), name='UserListAPI'),
    path('users/<str:pk>', UserDetailView.as_view(), name='UserDetailView'),
]
