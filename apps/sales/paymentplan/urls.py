from django.urls import path

from apps.sales.paymentplan.views import PaymentPlanList, PaymentPlanListAPI

urlpatterns = [
    path('lists', PaymentPlanList.as_view(), name='PaymentPlanList'),
    path('api/lists', PaymentPlanListAPI.as_view(), name='PaymentPlanListAPI'),
]
