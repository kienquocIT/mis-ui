from django.urls import path

from apps.sales.acceptance.views import FinalAcceptanceList, FinalAcceptanceListAPI

urlpatterns = [
    path('final-acceptance', FinalAcceptanceList.as_view(), name='FinalAcceptanceList'),
    path('api/final-acceptance', FinalAcceptanceListAPI.as_view(), name='FinalAcceptanceListAPI'),
]
