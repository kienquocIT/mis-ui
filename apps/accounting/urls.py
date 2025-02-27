from django.urls import path, include

urlpatterns = [
    path('accounting-settings/', include('apps.accounting.accountingsettings.urls')),
    path('journal-entry/', include('apps.accounting.journalentry.urls')),
]
