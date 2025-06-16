from django.urls import path
from apps.sales.productmodification.views import (
    ProductModificationList, ProductModificationCreate, ProductModificationDetail, ProductModificationUpdate,
    ProductModificationListAPI, ProductModificationDetailAPI, WarehouseListByProductAPI, ProductSerialListAPI,
    ProductModifiedListAPI, ProductComponentListAPI, ComponentInsertedListAPI, ProductLotListAPI,
    ProductModificationDDListAPI, ProductModificationProductGRListAPI,
)

urlpatterns = [
    path('list', ProductModificationList.as_view(), name='ProductModificationList'),
    path('create', ProductModificationCreate.as_view(), name='ProductModificationCreate'),
    path('detail/<str:pk>', ProductModificationDetail.as_view(), name='ProductModificationDetail'),
    path('update/<str:pk>', ProductModificationUpdate.as_view(), name='ProductModificationUpdate'),
    path('list/api', ProductModificationListAPI.as_view(), name='ProductModificationListAPI'),
    path('detail/api/<str:pk>', ProductModificationDetailAPI.as_view(), name='ProductModificationDetailAPI'),
    # RELATED API
    path('product-modified-list/api', ProductModifiedListAPI.as_view(), name='ProductModifiedListAPI'),
    path('product-component-list/api', ProductComponentListAPI.as_view(), name='ProductComponentListAPI'),
    path('warehouse-list-by-product/api', WarehouseListByProductAPI.as_view(), name='WarehouseListByProductAPI'),
    path('product-lot-list/api', ProductLotListAPI.as_view(), name='ProductLotListAPI'),
    path('product-serial-list/api', ProductSerialListAPI.as_view(), name='ProductSerialListAPI'),
    path('product-inserted-list/api', ComponentInsertedListAPI.as_view(), name='ComponentInsertedListAPI'),
    path('dropdown/api', ProductModificationDDListAPI.as_view(), name='ProductModificationDDListAPI'),
    path(
        'product-modification-product-gr/api',
        ProductModificationProductGRListAPI.as_view(),
        name='ProductModificationProductGRListAPI'
    ),
]
