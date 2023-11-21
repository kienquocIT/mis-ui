from django.urls import re_path, path

from apps.web_builder.views.viewer import CompanyWebsitePathView, PublicProductListAPI

urlpatterns = [
    path('api/products', PublicProductListAPI.as_view(), name='PublicProductListAPI'),
    re_path(
        route=r'^(?!config)(?!api)(?P<path_sub>((\w+)|(\/)|(-))*)', view=CompanyWebsitePathView.as_view(),
        name='CompanyWebsitePathView'
    ),
]
