from django.urls import path
from .views import HomeView, ComponentCollections, TermsAndConditionsView, HelpAndSupportView

urlpatterns = [
    path('', HomeView.as_view(), name='HomeView'),
    path('terms', TermsAndConditionsView.as_view(), name='TermsAndConditionsView'),
    path('help-and-support', HelpAndSupportView.as_view(), name='HelpAndSupportView'),
    path('<str:space_code>', HomeView.as_view(), name='HomeViewSpace'),
    path('components/', ComponentCollections.as_view(), name='ComponentCollections'),
]
