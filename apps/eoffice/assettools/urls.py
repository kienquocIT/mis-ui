from django.urls import path

from apps.eoffice.assettools.views import AssetToolsConfigView, AssetToolsConfigViewAPI, AssetToolsProvideRequestList, \
    AssetToolsProvideRequestListAPI, AssetToolsProvideRequestCreate, AssetToolsProvideRequestDetail, \
    AssetToolsProvideRequestCreateAPI, AssetToolsProvideRequestEdit, AssetToolsProvideRequestEditAPI, \
    AssetToolsProvideRequestDetailAPI

urlpatterns = [
    path('config', AssetToolsConfigView.as_view(), name='AssetToolsConfigView'),
    path('config-api', AssetToolsConfigViewAPI.as_view(), name='AssetToolsConfigViewAPI'),
    path('provide/list', AssetToolsProvideRequestList.as_view(), name='AssetToolsProvideRequestList'),
    path('provide/list-api', AssetToolsProvideRequestListAPI.as_view(), name='AssetToolsProvideRequestListAPI'),
    path('provide/create', AssetToolsProvideRequestCreate.as_view(), name='AssetToolsProvideRequestCreate'),
    path('provide/create-api', AssetToolsProvideRequestCreateAPI.as_view(), name='AssetToolsProvideRequestCreateAPI'),
    path('provide/detail/<str:pk>', AssetToolsProvideRequestDetail.as_view(), name='AssetToolsProvideRequestDetail'),
    path(
        'provide/detail-api/<str:pk>', AssetToolsProvideRequestDetailAPI.as_view(),
        name='AssetToolsProvideRequestDetailAPI'
    ),
    path('provide/update/<str:pk>', AssetToolsProvideRequestEdit.as_view(), name='AssetToolsProvideRequestEdit'),
    path(
        'provide/update-api/<str:pk>', AssetToolsProvideRequestEditAPI.as_view(), name='AssetToolsProvideRequestEditAPI'
    ),
]
