from django.urls import path
from apps.sales.lead.views import (
    LeadList, LeadCreate, LeadDetail, LeadUpdate, LeadListAPI, LeadDetailAPI,
    LeadChartDataAPI, LeadListForOpportunityAPI, LeadCallListAPI, LeadActivityListAPI, LeadEmailListAPI,
    LeadMeetingListAPI, LeadCallDetailAPI, LeadMeetingDetailAPI
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
    path('api/call/list', LeadCallListAPI.as_view(), name='LeadCallListAPI'),
    path('api/call/detail/<str:pk>', LeadCallDetailAPI.as_view(), name='LeadCallDetailAPI'),
    path('api/email/list', LeadEmailListAPI.as_view(), name='LeadEmailListAPI'),
    path('api/meeting/list', LeadMeetingListAPI.as_view(), name='LeadMeetingListAPI'),
    path('api/meeting/detail/<str:pk>', LeadMeetingDetailAPI.as_view(), name='LeadMeetingDetailAPI'),
    path('api/activity/list', LeadActivityListAPI.as_view(), name='LeadActivityListAPI')
]
