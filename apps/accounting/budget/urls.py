from django.urls import path

from apps.accounting.budget.views import BudgetLineListAPI

urlpatterns = [
    path('budget-line/api/lists', BudgetLineListAPI.as_view(), name='BudgetLineListAPI'),
]
