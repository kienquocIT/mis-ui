from django.urls import path

from apps.sales.leaseorder.views import LeaseOrderCreate

urlpatterns = [
    path('create', LeaseOrderCreate.as_view(), name='LeaseOrderCreate'),
]
