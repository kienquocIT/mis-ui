from django.urls import path

from apps.web_builder.views import (
    MyCompanyWebsiteList, MyCompanyWebsiteDetailAPI,
    AddNewCompanyWebsite, WebsiteDetailDesign, WebsiteDetailDesignSave,
)

urlpatterns = [
    path(route='config', view=MyCompanyWebsiteList.as_view(), name='MyCompanyWebsiteList'),
    path(route='config/add', view=AddNewCompanyWebsite.as_view(), name='AddNewCompanyWebsite'),
    path(route='config/<str:pk>', view=MyCompanyWebsiteDetailAPI.as_view(), name='MyCompanyWebsiteDetailAPI'),
    path(route='config/<str:pk>/design', view=WebsiteDetailDesign.as_view(), name='WebsiteDetailDesign'),
    path('config/<str:pk>/design/update', view=WebsiteDetailDesignSave.as_view(), name='WebsiteDetailDesignSave'),
]
