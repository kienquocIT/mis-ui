from django.urls import path

from apps.sales.revenueplan.views import (
    RevenuePlanUpdate, RevenuePlanDetail, RevenuePlanDetailAPI,
    RevenuePlanListAPI, RevenuePlanList, RevenuePlanCreate
)

urlpatterns = [
    path('lists', RevenuePlanList.as_view(), name='RevenuePlanList'),
    path('lists/api', RevenuePlanListAPI.as_view(), name='RevenuePlanListAPI'),
    path('create', RevenuePlanCreate.as_view(), name='RevenuePlanCreate'),
    path('detail', RevenuePlanDetail.as_view(), name='RevenuePlanDetail'),
    path('detail/<str:pk>', RevenuePlanDetail.as_view(), name='RevenuePlanDetail'),
    path('update', RevenuePlanUpdate.as_view(), name='RevenuePlanUpdate'),
    path('update/<str:pk>', RevenuePlanUpdate.as_view(), name='RevenuePlanUpdate'),
    path('api/<str:pk>', RevenuePlanDetailAPI.as_view(), name='RevenuePlanDetailAPI'),
]