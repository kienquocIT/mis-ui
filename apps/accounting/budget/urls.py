from django.urls import path

from apps.accounting.budget.views import BudgetLineListAPI, BudgetListAPI

urlpatterns = [
    path('api/lists', BudgetListAPI.as_view(), name='BudgetListAPI'),
    path('budget-line/api/lists', BudgetLineListAPI.as_view(), name='BudgetLineListAPI'),
]
