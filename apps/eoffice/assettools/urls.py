from django.urls import path

from apps.eoffice.assettools.views import AssetToolsConfigView

urlpatterns = [
    path('config', AssetToolsConfigView.as_view(), name='AssetToolsConfigView'),
]
