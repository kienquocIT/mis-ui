from django.urls import path

from apps.core.auths.views import (
    AuthLogin, AuthLogout, TenantLoginChoice,
    SwitchCompanyCurrentView, SpaceChangeView,
    MyLanguageAPI,
    AuthLoginSelectTenant,
    ForgotPasswordView, ForgotPasswordAPI, ForgotPasswordDetailAPI,
    ChangePasswordView, ChangePasswordAPI,
)
from apps.core.auths.views_2fa import (
    TwoFAIntegrateAPI, MyProfileView, TwoFAIntegrateDetailAPI,
    TwoFAVerifyView, TwoFAVerifyAPIView,
)

urlpatterns = [
    path('login', AuthLogin.as_view(), name='AuthLogin'),
    path('forgot-password', ForgotPasswordView.as_view(), name='ForgotPasswordView'),
    path('forgot-password/api', ForgotPasswordAPI.as_view(), name='ForgotPasswordAPI'),
    path('forgot-password/<str:pk>/api', ForgotPasswordDetailAPI.as_view(), name='ForgotPasswordDetailAPI'),
    path('login/select-tenant', AuthLoginSelectTenant.as_view(), name='AuthLoginSelectTenant'),
    path('logout', AuthLogout.as_view(), name='AuthLogout'),

    path('language', MyLanguageAPI.as_view(), name='MyLanguageAPI'),
    path('tenants', TenantLoginChoice.as_view(), name='TenantLoginChoice'),
    path('switch-company', SwitchCompanyCurrentView.as_view(), name='SwitchCompanyCurrentView'),
    path('change-space', SpaceChangeView.as_view(), name='SpaceChangeView'),
    path('change-password', ChangePasswordView.as_view(), name='ChangePasswordView'),
    path('change-password/api', ChangePasswordAPI.as_view(), name='ChangePasswordAPI'),

    path('my-profile', MyProfileView.as_view(), name='MyProfileView'),
    path('2fa', TwoFAVerifyView.as_view(), name='TwoFAVerifyView'),
    path('2fa/api', TwoFAVerifyAPIView.as_view(), name='TwoFAVerifyAPIView'),
    path('2fa/integrate/api', TwoFAIntegrateAPI.as_view(), name='TwoFAIntegrateAPI'),
    path('2fa/integrate/api/<str:pk>', TwoFAIntegrateDetailAPI.as_view(), name='TwoFAIntegrateDetailAPI'),
]
