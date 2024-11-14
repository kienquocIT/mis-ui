from django.urls import path, include

urlpatterns = [
    path('accounting-settings/', include('apps.accounting.accountingsettings.urls')),
]
