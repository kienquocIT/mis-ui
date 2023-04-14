from django.urls import path
from .views import DefaultDataView

urlpatterns = [
    path('default-data', DefaultDataView.as_view(), name='DefaultDataView'),
]
