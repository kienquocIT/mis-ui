from django.urls import path

from apps.core.diagram.views import DiagramListAPI

urlpatterns = [
    path('api/lists', DiagramListAPI.as_view(), name='DiagramListAPI'),
]