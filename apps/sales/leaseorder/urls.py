from django.urls import path

from apps.sales.leaseorder.views import LeaseOrderCreate, LeaseOrderDetail, LeaseOrderListAPI, LeaseOrderDetailAPI, \
    LeaseOrderUpdate, LeaseOrderList, LeaseOrderDetailDeliveryAPI, LORecurrenceListAPI, LeaseOrderConfigDetail, \
    LeaseOrderConfigDetailAPI

urlpatterns = [
    path('config', LeaseOrderConfigDetail.as_view(), name='LeaseOrderConfigDetail'),
    path('config/api', LeaseOrderConfigDetailAPI.as_view(), name='LeaseOrderConfigDetailAPI'),
    path('lists', LeaseOrderList.as_view(), name='LeaseOrderList'),
    path('api/lists', LeaseOrderListAPI.as_view(), name='LeaseOrderListAPI'),
    path('create', LeaseOrderCreate.as_view(), name='LeaseOrderCreate'),
    path('detail/<str:pk>', LeaseOrderDetail.as_view(), name='LeaseOrderDetail'),
    path('detail-api/<str:pk>', LeaseOrderDetailAPI.as_view(), name='LeaseOrderDetailAPI'),
    path('update/<str:pk>', LeaseOrderUpdate.as_view(), name='LeaseOrderUpdate'),
    path('detail-api/<str:pk>/delivery', LeaseOrderDetailDeliveryAPI.as_view(), name='LeaseOrderDetailDeliveryAPI'),

    path('lease-order-recurrence/list', LORecurrenceListAPI.as_view(), name='LORecurrenceListAPI'),
]
