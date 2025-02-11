from django.urls import path

from apps.sales.fixedasset.views import FixedAssetList, FixedAssetCreate, FixedAssetListAPI, FixedAssetDetailAPI, \
    FixedAssetDetail

urlpatterns = [
    path('list', FixedAssetList.as_view(), name='FixedAssetList'),
    path('create', FixedAssetCreate.as_view(), name='FixedAssetCreate'),
    path('detail/<str:pk>', FixedAssetDetail.as_view(), name='FixedAssetDetail'),

    #api
    path('api/list', FixedAssetListAPI.as_view(), name='FixedAssetListAPI'),
    path('api/detail/<str:pk>', FixedAssetDetailAPI.as_view(), name='FixedAssetDetailAPI'),
]
