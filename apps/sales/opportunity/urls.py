from django.urls import path
from apps.sales.opportunity.views import (
    # main
    OpportunityList, OpportunityDetail, OpportunityUpdate, OpportunityListAPI, OpportunityDetailAPI,
    # activities
    OpportunityActivityLogListAPI,
    OpportunityCallLogList, OpportunityCallLogListAPI, OpportunityCallLogDetailAPI,
    OpportunityEmailList, OpportunityEmailListAPI, OpportunityEmailDetailAPI,
    OpportunityMeetingList, OpportunityMeetingListAPI, OpportunityMeetingDetailAPI,
    OpportunityDocumentList, OpportunityDocumentCreate, OpportunityDocumentDetail,
    OpportunityDocumentListAPI, OpportunityDocumentDetailAPI,
    # config
    OpportunityConfigDetail, OpportunityConfigDetailAPI,
    # stages
    OpportunityConfigStageListAPI, OpportunityConfigStageDetailAPI,
    # related
    OpportunityCustomerDecisionFactorListAPI, OpportunityCustomerDecisionFactorDetailAPI,
    OpportunityMemberListAPI, OpportunityMemberDetailAPI
)

urlpatterns = [
    # main
    path('list', OpportunityList.as_view(), name='OpportunityList'),
    path('detail/<str:pk>', OpportunityDetail.as_view(), name='OpportunityDetail'),
    path('update/<str:pk>', OpportunityUpdate.as_view(), name='OpportunityUpdate'),
    path('list/api', OpportunityListAPI.as_view(), name='OpportunityListAPI'),
    path('detail/api/<str:pk>', OpportunityDetailAPI.as_view(), name='OpportunityDetailAPI'),
    # activities
    path('activity-log/list/api', OpportunityActivityLogListAPI.as_view(), name='OpportunityActivityLogListAPI'),
    path('call-log/list', OpportunityCallLogList.as_view(), name='OpportunityCallLogList'),
    path('call-log/list/api', OpportunityCallLogListAPI.as_view(), name='OpportunityCallLogListAPI'),
    path('call-log/detail/api/<str:pk>', OpportunityCallLogDetailAPI.as_view(), name='OpportunityCallLogDetailAPI'),
    path('send-email/list', OpportunityEmailList.as_view(), name='OpportunityEmailList'),
    path('send-email/list/api', OpportunityEmailListAPI.as_view(), name='OpportunityEmailListAPI'),
    path('send-email/detail/<str:pk>', OpportunityEmailDetailAPI.as_view(), name='OpportunityEmailDetailAPI'),
    path('meeting/list', OpportunityMeetingList.as_view(), name='OpportunityMeetingList'),
    path('meeting/list/api', OpportunityMeetingListAPI.as_view(), name='OpportunityMeetingListAPI'),
    path('meeting/detail/api/<str:pk>', OpportunityMeetingDetailAPI.as_view(), name='OpportunityMeetingDetailAPI'),
    path('document/list', OpportunityDocumentList.as_view(), name='OpportunityDocumentList'),
    path('document/create', OpportunityDocumentCreate.as_view(), name='OpportunityDocumentCreate'),
    path('document/detail/<str:pk>', OpportunityDocumentDetail.as_view(), name='OpportunityDocumentDetail'),
    path('document/list/api', OpportunityDocumentListAPI.as_view(), name='OpportunityDocumentListAPI'),
    path('document/list/api/<str:pk>', OpportunityDocumentDetailAPI.as_view(), name='OpportunityDocumentDetailAPI'),
    # config
    path('config-detail', OpportunityConfigDetail.as_view(), name='OpportunityConfigDetail'),
    path('config-detail/api', OpportunityConfigDetailAPI.as_view(), name='OpportunityConfigDetailAPI'),
    # stages
    path('config/stage/list/api', OpportunityConfigStageListAPI.as_view(), name='OpportunityConfigStageListAPI'),
    path('config/stage/detail/api/<str:pk>', OpportunityConfigStageDetailAPI.as_view(), name='OpportunityConfigStageDetailAPI'),
    # related
    path('config/decision-factor/list/api', OpportunityCustomerDecisionFactorListAPI.as_view(), name='OpportunityCustomerDecisionFactorListAPI'),
    path('config/decision-factor/detail/api/<str:pk>', OpportunityCustomerDecisionFactorDetailAPI.as_view(), name='OpportunityCustomerDecisionFactorDetailAPI'),
    path('detail/api/<str:pk_opp>/member/list', OpportunityMemberListAPI.as_view(), name='OpportunityMemberListAPI'),
    path('detail/api/<str:pk_opp>/member/<str:pk_member>', OpportunityMemberDetailAPI.as_view(), name='OpportunityMemberDetailAPI'),
]
