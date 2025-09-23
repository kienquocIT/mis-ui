from django.urls import path
from apps.sales.distributionplan.views import (
    DistributionPlanList, DistributionPlanCreate, DistributionPlanDetail, DistributionPlanUpdate,
    DistributionPlanListAPI, DistributionPlanDetailAPI, ProductListDistributionPlanAPI,
)

urlpatterns = [
    path('list', DistributionPlanList.as_view(), name='DistributionPlanList'),
    path('create', DistributionPlanCreate.as_view(), name='DistributionPlanCreate'),
    path('detail/<str:pk>', DistributionPlanDetail.as_view(), name='DistributionPlanDetail'),
    path('update/<str:pk>', DistributionPlanUpdate.as_view(), name='DistributionPlanUpdate'),
    path('api', DistributionPlanListAPI.as_view(), name='DistributionPlanListAPI'),
    path('api/<str:pk>', DistributionPlanDetailAPI.as_view(), name='DistributionPlanDetailAPI'),
    path('product/list/api/<str:pk>', ProductListDistributionPlanAPI.as_view(), name='ProductListDistributionPlanAPI')
]
