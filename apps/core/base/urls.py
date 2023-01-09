from django.urls import path

from apps.core.base.views import PlanListAPI


urlpatterns = [
    path('plan/api', PlanListAPI.as_view(), name='PlanListAPI'),
]