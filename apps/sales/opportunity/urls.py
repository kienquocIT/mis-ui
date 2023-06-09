from django.urls import path

from apps.sales.opportunity.views import OpportunityList, OpportunityListAPI, OpportunityDetail, OpportunityDetailAPI

urlpatterns = [
    path('lists', OpportunityList.as_view(), name='OpportunityList'),
    path('api/lists', OpportunityListAPI.as_view(), name='OpportunityListAPI'),

    path('<str:pk>', OpportunityDetail.as_view(), name='OpportunityDetail'),
    path('api/<str:pk>', OpportunityDetailAPI.as_view(), name='OpportunityDetailAPI'),
]
