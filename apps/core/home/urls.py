from django.urls import path
from .views import HomeView, ComponentCollections

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
    path('components/', ComponentCollections.as_view(), name='ComponentCollections'),
]
