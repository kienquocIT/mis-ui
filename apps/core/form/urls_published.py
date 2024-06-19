from django.urls import path

from apps.core.form.views_published import (
    FormPublishDetailFromFormAPI, FormPublishDetailAPI, FormPublishDetailView,
    FormPublishDetailViewIFrame, FormDetailThemeAPI,
)

urlpatterns = [
    path('form/<str:pk_form>', FormPublishDetailFromFormAPI.as_view(), name='FormPublishDetailFromFormAPI'),
    path('detail/<str:pk>', FormPublishDetailAPI.as_view(), name='FormPublishDetailAPI'),
    path('detail/<str:pk>/theme', FormDetailThemeAPI.as_view(), name='FormDetailThemeAPI'),
    path('view/<str:pk>', FormPublishDetailView.as_view(), name='FormPublishDetailView'),
    path('view-iframe', FormPublishDetailViewIFrame.as_view(), name='FormPublishDetailViewIFrame'),
]
