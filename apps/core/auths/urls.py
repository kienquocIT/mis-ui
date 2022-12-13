from django.urls import path

from apps.core.auths.views import AuthLogin, AuthLogout, TenantLoginChoice

urlpatterns = [
    path('login', AuthLogin.as_view(), name='AuthLogin'),
    path('logout', AuthLogout.as_view(), name='AuthLogout'),
    path('tenants', TenantLoginChoice.as_view(), name='TenantLoginChoice'),
]
