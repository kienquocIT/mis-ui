from django.urls import path

from apps.sales.grouporder.views import GroupOrderList, GroupOrderCreate, GroupOrderProductList, GroupOrderListAPI, \
    GroupOrderDetail, GroupOrderDetailAPI, GroupOrderUpdate

urlpatterns = [
    # view urls
    path('list', GroupOrderList.as_view(), name='GroupOrderList'),
    path('create', GroupOrderCreate.as_view(), name='GroupOrderCreate'),
    path('detail/<str:pk>', GroupOrderDetail.as_view(), name='GroupOrderDetail'),
    path('update/<str:pk>', GroupOrderUpdate.as_view(), name='GroupOrderUpdate'),

    # api urls
    path('api/product/list', GroupOrderProductList.as_view(), name='GroupOrderProductList'),
    path('api/list', GroupOrderListAPI.as_view(), name='GroupOrderListAPI'),
    path('api/detail/<str:pk>', GroupOrderDetailAPI.as_view(), name='GroupOrderDetailAPI'),
]
