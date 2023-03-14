from django.urls import path

from apps.core.base.views import PlanListAPI, ApplicationListAPI


urlpatterns = [
    path('plan/api', PlanListAPI.as_view(), name='PlanListAPI'),
    path('applications-list/api', ApplicationListAPI.as_view(), name='ApplicationListAPI'),
]