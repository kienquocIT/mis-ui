from django.urls import path

from apps.sales.asset.views import FixedAssetList, FixedAssetCreate, FixedAssetDetail, FixedAssetUpdate, \
    FixedAssetListAPI, FixedAssetDetailAPI

fixed_asset_urlpatterns = [
    path('fixed-asset/list', FixedAssetList.as_view(), name='FixedAssetList'),
    path('fixed-asset/create', FixedAssetCreate.as_view(), name='FixedAssetCreate'),
    path('fixed-asset/detail/<str:pk>', FixedAssetDetail.as_view(), name='FixedAssetDetail'),
    path('fixed-asset/update/<str:pk>', FixedAssetUpdate.as_view(), name='FixedAssetUpdate'),

    #api
    path('fixed-asset/api/list', FixedAssetListAPI.as_view(), name='FixedAssetListAPI'),
    path('fixed-asset/api/detail/<str:pk>', FixedAssetDetailAPI.as_view(), name='FixedAssetDetailAPI'),
]

urlpatterns = fixed_asset_urlpatterns