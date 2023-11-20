from django.urls import path

from .views import PublicProductListAPI, PublicProductDetailAPI

urlpatterns = [
    path('products', PublicProductListAPI.as_view(), name='PublicProductListAPI'),
    path('product/<str:pk>', PublicProductDetailAPI.as_view(), name='PublicProductDetailAPI'),
]
