from django.urls import re_path

from apps.web_builder.views import CompanyWebsitePathView

urlpatterns = [
    re_path(
        route=r'^(?!config)(?P<path_sub>((\w+)|(\/)|(-))*)', view=CompanyWebsitePathView.as_view(),
        name='CompanyWebsitePathView'
    ),
]
