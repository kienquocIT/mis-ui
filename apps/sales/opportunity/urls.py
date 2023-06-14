from django.urls import path

from apps.sales.opportunity.views import OpportunityList, OpportunityListAPI, OpportunityDetail, OpportunityDetailAPI, \
    OpportunityCustomerDecisionFactorListAPI, OpportunityConfig, OpportunityConfigAPI, \
    OpportunityCustomerDecisionFactorDetailAPI

urlpatterns = [
    path('config', OpportunityConfig.as_view(), name='OpportunityConfig'),
    path('config/api', OpportunityConfigAPI.as_view(), name='OpportunityConfigAPI'),
    path('lists', OpportunityList.as_view(), name='OpportunityList'),
    path('api/lists', OpportunityListAPI.as_view(), name='OpportunityListAPI'),

    path('<str:pk>', OpportunityDetail.as_view(), name='OpportunityDetail'),
    path('api/<str:pk>', OpportunityDetailAPI.as_view(), name='OpportunityDetailAPI'),

    path(
        'config/decision-factors/api',
        OpportunityCustomerDecisionFactorListAPI.as_view(),
        name='OpportunityCustomerDecisionFactorListAPI'
    ),
    path(
        'config/decision-factor/api/<str:pk>',
        OpportunityCustomerDecisionFactorDetailAPI.as_view(),
        name='OpportunityCustomerDecisionFactorDetailAPI'
    ),
]
