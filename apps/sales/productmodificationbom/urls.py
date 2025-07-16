from django.urls import path
from apps.sales.productmodificationbom.views import (
    ProductModificationBOMList, ProductModificationBOMCreate, ProductModificationBOMDetail,
    ProductModificationBOMUpdate,
    ProductModificationBOMListAPI, ProductModificationBOMDetailAPI,
    PMBOMProductModifiedListAPI, PMBOMProductComponentListAPI,
    PMBOMProductModifiedBeforeListAPI, PMBOMLatestComponentListAPI, PMBOMProductDDListAPI,
)

urlpatterns = [
    path('list', ProductModificationBOMList.as_view(), name='ProductModificationBOMList'),
    path('create', ProductModificationBOMCreate.as_view(), name='ProductModificationBOMCreate'),
    path('detail/<str:pk>', ProductModificationBOMDetail.as_view(), name='ProductModificationBOMDetail'),
    path('update/<str:pk>', ProductModificationBOMUpdate.as_view(), name='ProductModificationBOMUpdate'),
    path('list/api', ProductModificationBOMListAPI.as_view(), name='ProductModificationBOMListAPI'),
    path('detail/api/<str:pk>', ProductModificationBOMDetailAPI.as_view(), name='ProductModificationBOMDetailAPI'),
    # RELATED API
    path('product-modified-list/api', PMBOMProductModifiedListAPI.as_view(), name='PMBOMProductModifiedListAPI'),
    path('product-dd-list/api', PMBOMProductDDListAPI.as_view(), name='PMBOMProductDDListAPI'),
    path('product-modified-before-list/api', PMBOMProductModifiedBeforeListAPI.as_view(), name='PMBOMProductModifiedBeforeListAPI'),
    path('product-component-list/api', PMBOMProductComponentListAPI.as_view(), name='PMBOMProductComponentListAPI'),
    path('latest-component-list/api', PMBOMLatestComponentListAPI.as_view(), name='PMBOMLatestComponentListAPI'),
]
