from django.urls import path

from apps.web_builder.views import MyCompanyWebsiteList, MyCompanyWebsiteDetail

urlpatterns = [
    path(
        route='website',
        view=MyCompanyWebsiteList.as_view(),
        name='MyCompanyWebsiteList'
    ),
    path(
        route='website/<str:pk>',
        view=MyCompanyWebsiteDetail.as_view(),
        name='MyCompanyWebsiteDetail'
    ),
]
