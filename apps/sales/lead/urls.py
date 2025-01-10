from django.urls import path
from apps.sales.lead.views import (
    LeadList, LeadCreate, LeadDetail, LeadUpdate, LeadListAPI, LeadDetailAPI,
    LeadChartDataAPI, LeadListForOpportunityAPI, LeadCallListAPI
)

urlpatterns = [
    path('list', LeadList.as_view(), name='LeadList'),
    path('list-for-opp', LeadListForOpportunityAPI.as_view(), name='LeadListForOpportunityAPI'),
    path('chart-data', LeadChartDataAPI.as_view(), name='LeadChartDataAPI'),
    path('create', LeadCreate.as_view(), name='LeadCreate'),
    path('detail/<str:pk>', LeadDetail.as_view(), name='LeadDetail'),
    path('update/<str:pk>', LeadUpdate.as_view(), name='LeadUpdate'),
    path('api', LeadListAPI.as_view(), name='LeadListAPI'),
    path('api/<str:pk>', LeadDetailAPI.as_view(), name='LeadDetailAPI'),
    path('api/call/list', LeadCallListAPI.as_view(), name='LeadCallListAPI')

]
