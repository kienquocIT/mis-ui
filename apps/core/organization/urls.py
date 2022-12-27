from django.urls import path

from .views import OrganizationCreate

urlpatterns = [
    path('create', OrganizationCreate.as_view(), name='OrganizationCreate'),
]
