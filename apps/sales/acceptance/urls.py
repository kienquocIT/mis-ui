from django.urls import path

from apps.sales.acceptance.views import FinalAcceptanceList, FinalAcceptanceListAPI, FinalAcceptanceDetailAPI

urlpatterns = [
    path('final-acceptance/list', FinalAcceptanceList.as_view(), name='FinalAcceptanceList'),
    path('final-acceptance/api/list', FinalAcceptanceListAPI.as_view(), name='FinalAcceptanceListAPI'),
    path('final-acceptance/detail-api/<str:pk>', FinalAcceptanceDetailAPI.as_view(), name='FinalAcceptanceDetailAPI'),
]
