from django.urls import path

from apps.eoffice.assettools.views import AssetToolsConfigView, AssetToolsConfigViewAPI

urlpatterns = [
    path('config', AssetToolsConfigView.as_view(), name='AssetToolsConfigView'),
    path('config-api', AssetToolsConfigViewAPI.as_view(), name='AssetToolsConfigViewAPI'),
]
