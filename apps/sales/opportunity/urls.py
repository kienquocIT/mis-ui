from django.urls import path

from apps.sales.opportunity.views import (
    OpportunityList, OpportunityListAPI,
    OpportunityDetail, OpportunityDetailAPI, OpportunityCustomerDecisionFactorListAPI, OpportunityConfig,
    OpportunityConfigAPI, OpportunityCustomerDecisionFactorDetailAPI, OpportunityConfigStageListAPI,
    OpportunityConfigStageDetailAPI, RestoreDefaultStageAPI,
    OpportunityCallLogList, OpportunityCallLogListAPI, OpportunityCallLogDeleteAPI,
    OpportunityEmailList, OpportunityEmailListAPI, OpportunityEmailDeleteAPI,
    OpportunityMeetingList, OpportunityMeetingListAPI, OpportunityMeetingDeleteAPI, OpportunityActivityLogListAPI,
    OpportunityDocumentList, OpportunityDocumentCreate, OpportunityDocumentListAPI, OpportunityDocumentDetailAPI,
    OpportunityDocumentDetail, OpportunityForSaleListAPI, OpportunityUpdate, OpportunityMemberDetailAPI,
    OpportunityAddMemberAPI, OpportunityDeleteMemberAPI, OpportunityMemberPermissionUpdateAPI,
)

urlpatterns = [
    path('config', OpportunityConfig.as_view(), name='OpportunityConfig'),
    path('config/api', OpportunityConfigAPI.as_view(), name='OpportunityConfigAPI'),
    path('lists', OpportunityList.as_view(), name='OpportunityList'),
    path('api/lists', OpportunityListAPI.as_view(), name='OpportunityListAPI'),
    path('api/lists-sale', OpportunityForSaleListAPI.as_view(), name='OpportunityForSaleListAPI'),

    path('detail/<str:pk>', OpportunityDetail.as_view(), name='OpportunityDetail'),
    path('update/<str:pk>', OpportunityUpdate.as_view(), name='OpportunityUpdate'),
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
    path('api/delete/call-log/<str:pk>', OpportunityCallLogDeleteAPI.as_view(), name='OpportunityCallLogDeleteAPI'),

    path('send-email/lists', OpportunityEmailList.as_view(), name='OpportunityEmailList'),
    path('api/send-email/lists', OpportunityEmailListAPI.as_view(), name='OpportunityEmailListAPI'),
    path('api/delete/email/<str:pk>', OpportunityEmailDeleteAPI.as_view(), name='OpportunityEmailDeleteAPI'),

    path('meeting/lists', OpportunityMeetingList.as_view(), name='OpportunityMeetingList'),
    path('api/meeting/lists', OpportunityMeetingListAPI.as_view(), name='OpportunityMeetingListAPI'),
    path('api/delete/meeting/<str:pk>', OpportunityMeetingDeleteAPI.as_view(), name='OpportunityMeetingDeleteAPI'),

    path(
        'api/activity-log/lists', OpportunityActivityLogListAPI.as_view(),
        name='OpportunityActivityLogListAPI'
    ),
] + [
    path('document/list', OpportunityDocumentList.as_view(), name='OpportunityDocumentList'),
    path('document/create', OpportunityDocumentCreate.as_view(), name='OpportunityDocumentCreate'),
    path('document/detail/<str:pk>', OpportunityDocumentDetail.as_view(), name='OpportunityDocumentDetail'),

    path('document/list/api', OpportunityDocumentListAPI.as_view(), name='OpportunityDocumentListAPI'),
    path('document/list/api/<str:pk>', OpportunityDocumentDetailAPI.as_view(), name='OpportunityDocumentDetailAPI'),
] + [
    path('member/detail/api/<str:pk>', OpportunityMemberDetailAPI.as_view(), name='OpportunityMemberDetailAPI'),
    path('add-member/api/<str:pk>', OpportunityAddMemberAPI.as_view(), name='OpportunityAddMemberAPI'),
    path(
        'member/delete/api/<str:pk>',
        OpportunityDeleteMemberAPI.as_view(),
        name='OpportunityDeleteMemberAPI'
    ),
    path(
        'member/set/permission/api/<str:pk>',
        OpportunityMemberPermissionUpdateAPI.as_view(),
        name='OpportunityMemberPermissionUpdateAPI'
    )
]
