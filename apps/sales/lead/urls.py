from django.urls import path
from apps.sales.lead.views import (
    LeadList, LeadCreate, LeadDetail, LeadUpdate, LeadListAPI, LeadDetailAPI
)

urlpatterns = [
    path('leads', LeadList.as_view(), name='LeadList'),
    path('lead/create', LeadCreate.as_view(), name='LeadCreate'),
    path('lead/detail/<str:pk>', LeadDetail.as_view(), name='LeadDetail'),
    path('lead/update/<str:pk>', LeadUpdate.as_view(), name='LeadUpdate'),
    path('lead/api', LeadListAPI.as_view(), name='LeadListAPI'),
    path('lead/api/<str:pk>', LeadDetailAPI.as_view(), name='LeadDetailAPI')
]
