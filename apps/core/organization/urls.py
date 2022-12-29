from django.urls import path

from .views import OrganizationCreate, OrganizationList

urlpatterns = [
    path('create', OrganizationCreate.as_view(), name='OrganizationCreate'),
    path('list', OrganizationList.as_view(), name='OrganizationList'),
]
