from django.urls import path
from apps.sales.budgetplan.views import (
    BudgetPlanUpdate, BudgetPlanDetail, BudgetPlanDetailAPI,
    BudgetPlanListAPI, BudgetPlanList, BudgetPlanCreate
)

urlpatterns = [
    path('lists', BudgetPlanList.as_view(), name='BudgetPlanList'),
    path('lists/api', BudgetPlanListAPI.as_view(), name='BudgetPlanListAPI'),
    path('create', BudgetPlanCreate.as_view(), name='BudgetPlanCreate'),
    path('detail', BudgetPlanDetail.as_view(), name='BudgetPlanDetail'),
    path('detail/<str:pk>', BudgetPlanDetail.as_view(), name='BudgetPlanDetail'),
    path('update', BudgetPlanUpdate.as_view(), name='BudgetPlanUpdate'),
    path('update/<str:pk>', BudgetPlanUpdate.as_view(), name='BudgetPlanUpdate'),
    path('api/<str:pk>', BudgetPlanDetailAPI.as_view(), name='BudgetPlanDetailAPI'),
]
