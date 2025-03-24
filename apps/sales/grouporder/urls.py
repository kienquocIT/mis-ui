from django.urls import path

from apps.sales.grouporder.views import GroupOrderList, GroupOrderCreate, GroupOrderProductList

urlpatterns = [
    # view urls
    path('list', GroupOrderList.as_view(), name='GroupOrderList'),
    path('create', GroupOrderCreate.as_view(), name='GroupOrderCreate'),


    # api urls
    path('api/product/list', GroupOrderProductList.as_view(), name='GroupOrderProductList'),
]
