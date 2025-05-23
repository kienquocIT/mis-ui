from django.urls import path, include

urlpatterns = [
    # config
    path('', include('apps.kms.document_approval.urls')),
]
