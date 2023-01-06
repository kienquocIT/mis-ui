from django.urls import path, include

urlpatterns = [
    path('', include('apps.core.home.urls')),  # home page
    path('auth/', include('apps.core.auths.urls')),
    path('account/', include('apps.core.account.urls')),
    path('hr/', include('apps.core.hr.urls')),
]

