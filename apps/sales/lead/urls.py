from django.urls import path
from apps.sales.lead.views import (
    LeadList, LeadCreate, LeadDetail, LeadUpdate, LeadListAPI, LeadDetailAPI
)

urlpatterns = [
    path('list', LeadList.as_view(), name='LeadList'),
    path('create', LeadCreate.as_view(), name='LeadCreate'),
    path('detail/<str:pk>', LeadDetail.as_view(), name='LeadDetail'),
    path('update/<str:pk>', LeadUpdate.as_view(), name='LeadUpdate'),
    path('api', LeadListAPI.as_view(), name='LeadListAPI'),
    path('api/<str:pk>', LeadDetailAPI.as_view(), name='LeadDetailAPI')
]
