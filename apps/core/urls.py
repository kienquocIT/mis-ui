from django.urls import path, include

urlpatterns = [
    path('auth/', include('apps.core.auths.urls')),
    path('account/', include('apps.core.account.urls')),
    path('hr/', include('apps.core.hr.urls')),
    path('company/', include('apps.core.company.urls')),
    path('tenant/', include('apps.core.tenant.urls')),

    path('', include('apps.core.home.urls')),  # home page
]
