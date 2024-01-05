from django.urls import path

from .views import (
    DeliveryConfigDetail, DeliveryConfigDetailAPI,
    OrderPickingList, OrderPickingListAPI, OrderPickingDetail, OrderPickingDetailAPI, OrderDeliveryList,
    OrderDeliveryListAPI, OrderDeliveryDetail, OrderDeliveryDetailAPI, OrderDeliveryEdit, OrderPickingEdit
)

urlpatterns = [
    path('config', DeliveryConfigDetail.as_view(), name='DeliveryConfigDetail'),
    path('config/api', DeliveryConfigDetailAPI.as_view(), name='DeliveryConfigDetailAPI'),


    path('list', OrderDeliveryList.as_view(), name='OrderDeliveryList'),
    path('list/api', OrderDeliveryListAPI.as_view(), name='OrderDeliveryListAPI'),
    path('detail/<str:pk>', OrderDeliveryDetail.as_view(), name='OrderDeliveryDetail'),
    path('update/<str:pk>', OrderDeliveryEdit.as_view(), name='OrderDeliveryEdit'),
    path('<str:pk>/api', OrderDeliveryDetailAPI.as_view(), name='OrderDeliveryDetailAPI'),

    path('picking/list', OrderPickingList.as_view(), name='OrderPickingList'),
    path('picking/list/api', OrderPickingListAPI.as_view(), name='OrderPickingListAPI'),
    path('picking/detail/<str:pk>', OrderPickingDetail.as_view(), name='OrderPickingDetail'),
    path('picking/edit/<str:pk>', OrderPickingEdit.as_view(), name='OrderPickingEdit'),
    path('picking/<str:pk>/api', OrderPickingDetailAPI.as_view(), name='OrderPickingDetailAPI'),

]
