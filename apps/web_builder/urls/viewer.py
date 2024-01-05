from django.urls import re_path, path

from apps.web_builder.views.viewer import CompanyWebsitePathView, PublicProductListAPI, PublicProductDetailAPI

urlpatterns = [
    path('api/products', PublicProductListAPI.as_view(), name='PublicProductListAPI'),
    path('api/product/<str:pk>', PublicProductDetailAPI.as_view(), name='PublicProductDetailAPI'),
    re_path(
        route=r'^(?!config)(?!api)(?P<path_sub>((\w+)|(\/)|(-))*)', view=CompanyWebsitePathView.as_view(),
        name='CompanyWebsitePathView'
    ),
]
