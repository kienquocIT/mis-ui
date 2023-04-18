from django.urls import path

from apps.sales.opportunity.views import OpportunityListAPI

urlpatterns = [
    path('lists/api', OpportunityListAPI.as_view(), name='OpportunityListAPI'),
]
