from django.urls import path

from apps.sales.paymentplan.views import PaymentPlanList

urlpatterns = [
    path('lists', PaymentPlanList.as_view(), name='PaymentPlanList'),
    # path('api/lists', LeaseOrderListAPI.as_view(), name='LeaseOrderListAPI'),
]
