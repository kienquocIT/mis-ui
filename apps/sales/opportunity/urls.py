from django.urls import path

from apps.sales.opportunity.views import OpportunityList, OpportunityListAPI, OpportunityExpenseListAPI, \
    OpportunityDetail, OpportunityDetailAPI, OpportunityCustomerDecisionFactorListAPI, OpportunityConfig, \
    OpportunityConfigAPI, OpportunityCustomerDecisionFactorDetailAPI, OpportunityConfigStageListAPI, \
    OpportunityConfigStageDetailAPI, RestoreDefaultStageAPI, OpportunityCallLogList, OpportunityCallLogListAPI

urlpatterns = [
    path('config', OpportunityConfig.as_view(), name='OpportunityConfig'),
    path('config/api', OpportunityConfigAPI.as_view(), name='OpportunityConfigAPI'),
    path('lists', OpportunityList.as_view(), name='OpportunityList'),
    path('api/lists', OpportunityListAPI.as_view(), name='OpportunityListAPI'),
    path('opportunity-expense-list', OpportunityExpenseListAPI.as_view(), name='OpportunityExpenseListAPI'),

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
    path(
        'config/stage/api',
        OpportunityConfigStageListAPI.as_view(),
        name='OpportunityConfigStageListAPI'
    ),
    path(
        'config/stage/api/<str:pk>',
        OpportunityConfigStageDetailAPI.as_view(),
        name='OpportunityConfigStageDetailAPI'
    ),
    path(
        'config/stage/restore-default/<str:pk>',
        RestoreDefaultStageAPI.as_view(),
        name='RestoreDefaultStageAPI'
    )
] + [
    path('call-log/lists', OpportunityCallLogList.as_view(), name='OpportunityCallLogList'),
    path('api/call-log/lists', OpportunityCallLogListAPI.as_view(), name='OpportunityCallLogListAPI'),
    # path('call-log/<str:pk>', OpportunityCallLogDetail.as_view(), name='OpportunityCallLogDetail'),
]
