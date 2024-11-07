from django.urls import path, include

urlpatterns = [
    path('accounting/', include('apps.accounting.accountchart.urls')),
]
