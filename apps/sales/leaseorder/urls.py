from django.urls import path

from apps.sales.leaseorder.views import LeaseOrderCreate, LeaseOrderDetail, LeaseOrderListAPI, LeaseOrderDetailAPI, \
    LeaseOrderUpdate, LeaseOrderList

urlpatterns = [
    path('lists', LeaseOrderList.as_view(), name='LeaseOrderList'),
    path('api/lists', LeaseOrderListAPI.as_view(), name='LeaseOrderListAPI'),
    path('create', LeaseOrderCreate.as_view(), name='LeaseOrderCreate'),
    path('detail/<str:pk>', LeaseOrderDetail.as_view(), name='LeaseOrderDetail'),
    path('detail-api/<str:pk>', LeaseOrderDetailAPI.as_view(), name='LeaseOrderDetailAPI'),
    path('update/<str:pk>', LeaseOrderUpdate.as_view(), name='LeaseOrderUpdate'),
]
