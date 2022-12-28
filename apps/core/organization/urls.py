from django.urls import path

from .views import OrganizationCreate, OrganizationCreateAPI

urlpatterns = [
    path('create', OrganizationCreate.as_view(), name='OrganizationCreate'),
    path('create/api', OrganizationCreateAPI.as_view(), name='OrganizationCreateAPI'),
]
