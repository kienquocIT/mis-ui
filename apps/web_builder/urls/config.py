from django.urls import path

from apps.web_builder.views.config import (
    MyCompanyWebsiteList, MyCompanyWebsiteDetailAPI,
    AddNewCompanyWebsite, WebsiteDetailDesign, WebsiteDetailDesignSave,
    WebsiteDetailClone,
    TemplateList, TemplateDetail,
)

urlpatterns = [
    path(route='templates', view=TemplateList.as_view(), name='TemplateList'),
    path(route='template/<str:pk>', view=TemplateDetail.as_view(), name='TemplateDetail'),
    path(route='config', view=MyCompanyWebsiteList.as_view(), name='MyCompanyWebsiteList'),
    path(route='config/add', view=AddNewCompanyWebsite.as_view(), name='AddNewCompanyWebsite'),
    path(route='config/<str:pk>', view=MyCompanyWebsiteDetailAPI.as_view(), name='MyCompanyWebsiteDetailAPI'),
    path(route='config/<str:pk>/design', view=WebsiteDetailDesign.as_view(), name='WebsiteDetailDesign'),
    path(route='config/<str:pk>/clone', view=WebsiteDetailClone.as_view(), name='WebsiteDetailClone'),
    path('config/<str:pk>/design/update', view=WebsiteDetailDesignSave.as_view(), name='WebsiteDetailDesignSave'),
]
