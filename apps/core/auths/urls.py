from django.urls import path

from apps.core.auths.views import (
    AuthOAuth2Login,
    AuthLogin, AuthLogout, TenantLoginChoice,
    SwitchCompanyCurrentView, SpaceChangeView,
    MyLanguageAPI,
    AuthLoginSelectTenant, ForgotPasswordView, ChangePasswordView, ChangePasswordAPI,
)

urlpatterns = [
    path('login', AuthLogin.as_view(), name='AuthLogin'),
    path('forgot-password', ForgotPasswordView.as_view(), name='ForgotPasswordView'),
    path('login/select-tenant', AuthLoginSelectTenant.as_view(), name='AuthLoginSelectTenant'),
    path('login/oauth2', AuthOAuth2Login.as_view(), name='AuthOAuth2Login'),
    path('logout', AuthLogout.as_view(), name='AuthLogout'),
    path('language', MyLanguageAPI.as_view(), name='MyLanguageAPI'),
    path('tenants', TenantLoginChoice.as_view(), name='TenantLoginChoice'),
    path('switch-company', SwitchCompanyCurrentView.as_view(), name='SwitchCompanyCurrentView'),
    path('change-space', SpaceChangeView.as_view(), name='SpaceChangeView'),
    path('change-password', ChangePasswordView.as_view(), name='ChangePasswordView'),
    path('change-password/api', ChangePasswordAPI.as_view(), name='ChangePasswordAPI'),
]
