from django.urls import path

from .views import FixedAssetList, FixedAssetCreate, FixedAssetDetail, FixedAssetUpdate, \
    FixedAssetListAPI, FixedAssetDetailAPI, InstrumentToolList, InstrumentToolCreate, InstrumentToolDetail, \
    InstrumentToolUpdate, InstrumentToolListAPI, InstrumentToolDetailAPI, FixedAssetWriteOffList, \
    FixedAssetWriteOffCreate, FixedAssetWriteOffListAPI, FixedAssetWriteOffDetail, FixedAssetWriteOffDetailAPI, \
    FixedAssetWriteOffUpdate, InstrumentToolWriteOffList, InstrumentToolWriteOffCreate, InstrumentToolWriteOffDetail, \
    InstrumentToolWriteOffUpdate, InstrumentToolWriteOffListAPI, InstrumentToolWriteOffDetailAPI, \
    AssetForLeaseListAPI, ToolForLeaseListAPI, AssetStatusLeaseListAPI, ToolStatusLeaseListAPI, \
    InstrumentToolDDListAPI, FixedAssetListDDAPI

fixed_asset_urlpatterns = [
    path('fixed-asset/list', FixedAssetList.as_view(), name='FixedAssetList'),
    path('fixed-asset/dd-list', FixedAssetListDDAPI.as_view(), name='FixedAssetListDDAPI'),
    path('fixed-asset/create', FixedAssetCreate.as_view(), name='FixedAssetCreate'),
    path('fixed-asset/detail/<str:pk>', FixedAssetDetail.as_view(), name='FixedAssetDetail'),
    path('fixed-asset/update/<str:pk>', FixedAssetUpdate.as_view(), name='FixedAssetUpdate'),

    #api
    path('fixed-asset/api/list', FixedAssetListAPI.as_view(), name='FixedAssetListAPI'),
    path('fixed-asset/api/detail/<str:pk>', FixedAssetDetailAPI.as_view(), name='FixedAssetDetailAPI'),
    path('fixed-asset-for-lease/api/list', AssetForLeaseListAPI.as_view(), name='AssetForLeaseListAPI'),
    path('fixed-asset-status-lease/api/list', AssetStatusLeaseListAPI.as_view(), name='AssetStatusLeaseListAPI'),
]

instrument_tool_urlpatterns = [
    path('instrument-tool/list', InstrumentToolList.as_view(), name='InstrumentToolList'),
    path('instrument-tool/create', InstrumentToolCreate.as_view(), name='InstrumentToolCreate'),
    path('instrument-tool/detail/<str:pk>', InstrumentToolDetail.as_view(), name='InstrumentToolDetail'),
    path('instrument-tool/update/<str:pk>', InstrumentToolUpdate.as_view(), name='InstrumentToolUpdate'),

    #api
    path('instrument-tool/api/list', InstrumentToolListAPI.as_view(), name='InstrumentToolListAPI'),
    path('instrument-tool/api/dd-list', InstrumentToolDDListAPI.as_view(), name='InstrumentToolDDListAPI'),
    path('instrument-tool/api/detail/<str:pk>', InstrumentToolDetailAPI.as_view(), name='InstrumentToolDetailAPI'),
    path('instrument-tool-for-lease/api/list', ToolForLeaseListAPI.as_view(), name='ToolForLeaseListAPI'),
    path('instrument-tool-status-lease/api/list', ToolStatusLeaseListAPI.as_view(), name='ToolStatusLeaseListAPI'),
]

fa_write_off_urlpatterns = [
    path('fixed-asset-writeoff/list', FixedAssetWriteOffList.as_view(), name='FixedAssetWriteOffList'),
    path('fixed-asset-writeoff/create', FixedAssetWriteOffCreate.as_view(), name='FixedAssetWriteOffCreate'),
    path('fixed-asset-writeoff/detail/<str:pk>', FixedAssetWriteOffDetail.as_view(), name='FixedAssetWriteOffDetail'),
    path('fixed-asset-writeoff/update/<str:pk>', FixedAssetWriteOffUpdate.as_view(), name='FixedAssetWriteOffUpdate'),

    # api
    path('fixed-asset-writeoff/api/list', FixedAssetWriteOffListAPI.as_view(), name='FixedAssetWriteOffListAPI'),
    path('fixed-asset-writeoff/api/detail/<str:pk>', FixedAssetWriteOffDetailAPI.as_view(), name='FixedAssetWriteOffDetailAPI'),
]

it_write_off_urlpatterns = [
    path('instrument-tool-writeoff/list', InstrumentToolWriteOffList.as_view(), name='InstrumentToolWriteOffList'),
    path('instrument-tool-writeoff/create', InstrumentToolWriteOffCreate.as_view(), name='InstrumentToolWriteOffCreate'),
    path('instrument-tool-writeoff/detail/<str:pk>', InstrumentToolWriteOffDetail.as_view(), name='InstrumentToolWriteOffDetail'),
    path('instrument-tool-writeoff/update/<str:pk>', InstrumentToolWriteOffUpdate.as_view(), name='InstrumentToolWriteOffUpdate'),

    # api
    path('instrument-tool-writeoff/api/list', InstrumentToolWriteOffListAPI.as_view(), name='InstrumentToolWriteOffListAPI'),
    path('instrument-tool-writeoff/api/detail/<str:pk>', InstrumentToolWriteOffDetailAPI.as_view(), name='InstrumentToolWriteOffDetailAPI'),
]

urlpatterns = (
    fixed_asset_urlpatterns
    + instrument_tool_urlpatterns
    + fa_write_off_urlpatterns
    + it_write_off_urlpatterns
)