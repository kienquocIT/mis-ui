from django.urls import path

from apps.sales.asset.views import FixedAssetList, FixedAssetCreate, FixedAssetDetail, FixedAssetUpdate, \
    FixedAssetListAPI, FixedAssetDetailAPI, InstrumentToolList, InstrumentToolCreate, InstrumentToolDetail, \
    InstrumentToolUpdate, InstrumentToolListAPI, InstrumentToolDetailAPI

fixed_asset_urlpatterns = [
    path('fixed-asset/list', FixedAssetList.as_view(), name='FixedAssetList'),
    path('fixed-asset/create', FixedAssetCreate.as_view(), name='FixedAssetCreate'),
    path('fixed-asset/detail/<str:pk>', FixedAssetDetail.as_view(), name='FixedAssetDetail'),
    path('fixed-asset/update/<str:pk>', FixedAssetUpdate.as_view(), name='FixedAssetUpdate'),

    #api
    path('fixed-asset/api/list', FixedAssetListAPI.as_view(), name='FixedAssetListAPI'),
    path('fixed-asset/api/detail/<str:pk>', FixedAssetDetailAPI.as_view(), name='FixedAssetDetailAPI'),
]

instrument_tool_urlpatterns = [
    path('instrument-tool/list', InstrumentToolList.as_view(), name='InstrumentToolList'),
    path('instrument-tool/create', InstrumentToolCreate.as_view(), name='InstrumentToolCreate'),
    path('instrument-tool/detail/<str:pk>', InstrumentToolDetail.as_view(), name='InstrumentToolDetail'),
    path('instrument-tool/update/<str:pk>', InstrumentToolUpdate.as_view(), name='InstrumentToolUpdate'),

    #api
    path('instrument-tool/api/list', InstrumentToolListAPI.as_view(), name='InstrumentToolListAPI'),
    path('instrument-tool/api/detail/<str:pk>', InstrumentToolDetailAPI.as_view(), name='InstrumentToolDetailAPI'),
]

urlpatterns = fixed_asset_urlpatterns + instrument_tool_urlpatterns