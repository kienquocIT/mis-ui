from django.urls import path

from apps.sales.opportunity.views import OpportunityList, OpportunityListAPI, OpportunityExpenseListAPI

urlpatterns = [
    path('lists', OpportunityList.as_view(), name='OpportunityList'),
    path('api/lists', OpportunityListAPI.as_view(), name='OpportunityListAPI'),
    path('opportunity-expense-list', OpportunityExpenseListAPI.as_view(), name='OpportunityExpenseListAPI'),
]
