from django.urls import path
from .views import HomeView, HomeConditionAPI

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
    path('condition/create', HomeConditionAPI.as_view(), name='HomeConditionAPI'),
]
