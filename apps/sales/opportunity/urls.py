from django.urls import path

from apps.sales.opportunity.views import OpportunityList, OpportunityListAPI, OpportunityDetail, OpportunityDetailAPI, \
    OpportunityCustomerDecisionFactorListAPI

urlpatterns = [
    path('lists', OpportunityList.as_view(), name='OpportunityList'),
    path('api/lists', OpportunityListAPI.as_view(), name='OpportunityListAPI'),

    path('<str:pk>', OpportunityDetail.as_view(), name='OpportunityDetail'),
    path('api/<str:pk>', OpportunityDetailAPI.as_view(), name='OpportunityDetailAPI'),

    path(
        'config/decision-factors/api',
        OpportunityCustomerDecisionFactorListAPI.as_view(),
        name='OpportunityCustomerDecisionFactorListAPI'
    )
]
