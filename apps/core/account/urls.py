from django.urls import path

from apps.core.account.views import (
    UserListAPI, UserList, UserDetailAPI, UserCreate, UserDetail,
    UserEdit, UserResetPassword,
    UserTenantOverviewListAPI, UserMailWelcome,
    UserAdminTenant,
    UserCompaniesAPI,
)

urlpatterns = [
    path('users', UserList.as_view(), name='UserList'),
    path('tenant-users', UserTenantOverviewListAPI.as_view(), name='UserTenantOverviewListAPI'),
    path('users/create', UserCreate.as_view(), name='UserCreate'),
    path('user/detail/<str:pk>', UserDetail.as_view(), name='UserDetail'),
    path('user/edit/<str:pk>', UserEdit.as_view(), name='UserEdit'),
    path('user/reset-password/<str:pk>', UserResetPassword.as_view(), name='UserResetPassword'),
    path('user/mail-welcome/<str:pk>', UserMailWelcome.as_view(), name='UserMailWelcome'),
    path('user/companies/<str:pk>', UserCompaniesAPI.as_view(), name='UserCompaniesAPI'),
    path('users/api', UserListAPI.as_view(), name='UserListAPI'),
    path('user/detail/api/<str:pk>', UserDetailAPI.as_view(), name='UserDetailAPI'),
    path('user-admin-tenant', UserAdminTenant.as_view(), name='UserAdminTenant'),
]
