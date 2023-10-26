from django.urls import path

from apps.core.auths.views import (
    AuthOAuth2Login,
    AuthLogin, AuthLogout, TenantLoginChoice,
    SwitchCompanyCurrentView, SpaceChangeView,
    MyLanguageAPI,
)

urlpatterns = [
    path('login', AuthLogin.as_view(), name='AuthLogin'),
    path('login/oauth2', AuthOAuth2Login.as_view(), name='AuthOAuth2Login'),
    path('logout', AuthLogout.as_view(), name='AuthLogout'),
    path('language', MyLanguageAPI.as_view(), name='MyLanguageAPI'),
    path('tenants', TenantLoginChoice.as_view(), name='TenantLoginChoice'),
    path('switch-company', SwitchCompanyCurrentView.as_view(), name='SwitchCompanyCurrentView'),
    path('change-space', SpaceChangeView.as_view(), name='SpaceChangeView'),
]
