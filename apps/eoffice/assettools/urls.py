from django.urls import path

from apps.eoffice.assettools.views import AssetToolsConfigView, AssetToolsConfigViewAPI, AssetToolsProvideRequestList, \
    AssetToolsProvideRequestListAPI, AssetToolsProvideRequestCreate, AssetToolsProvideRequestDetail, \
    AssetToolsProvideRequestCreateAPI, AssetToolsProvideRequestEdit, AssetToolsProvideRequestEditAPI, \
    AssetToolsProvideRequestDetailAPI, AssetToolsDeliveryCreate, AssetProductListByProvideIDAPI, \
    AssetToolsDeliveryCreateAPI, AssetToolsDeliveryList, AssetToolsDeliveryListAPI, AssetToolsDeliveryDetail, \
    AssetToolsDeliveryEdit, AssetToolsDeliveryDetailAPI, AssetToolsDeliveryEditAPI, AssetToolsList, AssetToolsListAPI, \
    AssetToolsReturnCreate, AssetToolsReturnList, AssetToolsReturnCreateAPI, AssetToolsReturnListAPI, \
    AssetToolsReturnDetail, AssetToolsReturnDetailAPI, AssetToolsReturnEditAPI, AssetToolsReturnEdit

urlpatterns = [
    # config
    path('config', AssetToolsConfigView.as_view(), name='AssetToolsConfigView'),
    path('config-api', AssetToolsConfigViewAPI.as_view(), name='AssetToolsConfigViewAPI'),
    # ASSET, TOOLS LIST
    path('list', AssetToolsList.as_view(), name='AssetToolsList'),
    path('list-api', AssetToolsListAPI.as_view(), name='AssetToolsListAPI'),
    # provide
    path('provide/list', AssetToolsProvideRequestList.as_view(), name='AssetToolsProvideRequestList'),
    path('provide/list-api', AssetToolsProvideRequestListAPI.as_view(), name='AssetToolsProvideRequestListAPI'),
    path('provide/create', AssetToolsProvideRequestCreate.as_view(), name='AssetToolsProvideRequestCreate'),
    path('provide/create-api', AssetToolsProvideRequestCreateAPI.as_view(), name='AssetToolsProvideRequestCreateAPI'),
    path('provide/detail/<str:pk>', AssetToolsProvideRequestDetail.as_view(), name='AssetToolsProvideRequestDetail'),
    path(
        'provide/detail-api/<str:pk>', AssetToolsProvideRequestDetailAPI.as_view(),
        name='AssetToolsProvideRequestDetailAPI'
    ),
    path(
        'provide/product-by-id', AssetProductListByProvideIDAPI.as_view(),
        name='AssetProductListByProvideIDAPI'
    ),
    path('provide/update/<str:pk>', AssetToolsProvideRequestEdit.as_view(), name='AssetToolsProvideRequestEdit'),
    path(
        'provide/update-api/<str:pk>', AssetToolsProvideRequestEditAPI.as_view(), name='AssetToolsProvideRequestEditAPI'
    ),
    # delivery
    path('delivery/create', AssetToolsDeliveryCreate.as_view(), name='AssetToolsDeliveryCreate'),
    path('delivery/create-api', AssetToolsDeliveryCreateAPI.as_view(), name='AssetToolsDeliveryCreateAPI'),
    path('delivery/list', AssetToolsDeliveryList.as_view(), name='AssetToolsDeliveryList'),
    path('delivery/list-api', AssetToolsDeliveryListAPI.as_view(), name='AssetToolsDeliveryListAPI'),
    path('delivery/detail/<str:pk>', AssetToolsDeliveryDetail.as_view(), name='AssetToolsDeliveryDetail'),
    path('delivery/detail-api/<str:pk>', AssetToolsDeliveryDetailAPI.as_view(), name='AssetToolsDeliveryDetailAPI'),
    path('delivery/update/<str:pk>', AssetToolsDeliveryEdit.as_view(), name='AssetToolsDeliveryEdit'),
    path('delivery/update-api/<str:pk>', AssetToolsDeliveryEditAPI.as_view(), name='AssetToolsDeliveryEditAPI'),
    # asset return
    path('return/create', AssetToolsReturnCreate.as_view(), name='AssetToolsReturnCreate'),
    path('return/create-api', AssetToolsReturnCreateAPI.as_view(), name='AssetToolsReturnCreateAPI'),
    path('return/list', AssetToolsReturnList.as_view(), name='AssetToolsReturnList'),
    path('return/list-api', AssetToolsReturnListAPI.as_view(), name='AssetToolsReturnListAPI'),
    path('return/detail/<str:pk>', AssetToolsReturnDetail.as_view(), name='AssetToolsReturnDetail'),
    path('return/detail-api/<str:pk>', AssetToolsReturnDetailAPI.as_view(), name='AssetToolsReturnDetailAPI'),
    path('return/update/<str:pk>', AssetToolsReturnEdit.as_view(), name='AssetToolsReturnEdit'),
    path('return/update-api/<str:pk>', AssetToolsReturnEditAPI.as_view(), name='AssetToolsReturnEditAPI'),

]
