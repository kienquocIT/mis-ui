from django.urls import path

from .views import (
    DeliveryConfigDetail, DeliveryConfigDetailAPI,
    OrderPickingList, OrderPickingListAPI, OrderPickingDetail, OrderPickingDetailAPI,
)

urlpatterns = [
    path('config', DeliveryConfigDetail.as_view(), name='DeliveryConfigDetail'),
    path('config/api', DeliveryConfigDetailAPI.as_view(), name='DeliveryConfigDetailAPI'),

    path('list', OrderPickingList.as_view(), name='OrderPickingList'),
    path('list/api', OrderPickingListAPI.as_view(), name='OrderPickingListAPI'),
    path('<str:pk>', OrderPickingDetail.as_view(), name='OrderPickingDetail'),
    path('<str:pk>/api', OrderPickingDetailAPI.as_view(), name='OrderPickingDetailAPI'),
]
