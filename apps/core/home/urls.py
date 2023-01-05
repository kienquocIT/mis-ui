from django.urls import path
from .views import HomeView

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
]
