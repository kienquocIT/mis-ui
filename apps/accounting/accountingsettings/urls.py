from django.urls import path
from apps.accounting.accountingsettings.views import (
    ChartOfAccountsList, ChartOfAccountsListAPI,
    InitialBalanceList, InitialBalanceListAPI, DimensionDefinitionList, DimensionDefinitionListAPI,
    DimensionDefinitionDetailAPI, DimensionValueList, DimensionDefinitionWithValueAPI, DimensionValueListAPI,
    DimensionValueDetailAPI, DimensionSyncConfigApplicationListAPI, DimensionSyncConfigList, DimensionSyncConfigListAPI,
    DimensionSyncConfigDetailAPI, DimensionListForAccountingAccountAPI, DimensionAccountList, DimensionAccountListAPI,
    DimensionAccountDetailAPI, InitialBalanceDetail, InitialBalanceUpdate, InitialBalanceDetailAPI, AssetCategoryList,
    AssetCategoryListAPI, AssetCategoryDetailAPI, DimensionSplitTemplateList, DimensionSplitTemplateListAPI,
    DimensionSplitTemplateDetailAPI, JEDocumentTypeList, JEDocumentTypeListAPI, JEDocumentTypeDetailAPI,
    JEPostingRuleList, JEPostingRuleListAPI, JEPostingGroupList, JEGroupAssignmentList, JEGLAccountMappingList,
    JEPostingGroupListAPI, JEGroupAssignmentListAPI, JEGLAccountMappingListAPI, JEConfigureGuidePage
)

urlpatterns = [
    path('chart-of-accounts/list', ChartOfAccountsList.as_view(), name='ChartOfAccountsList'),
    path('chart-of-accounts/list/api', ChartOfAccountsListAPI.as_view(), name='ChartOfAccountsListAPI'),
] + [
    path('je-document-type/list', JEDocumentTypeList.as_view(), name='JEDocumentTypeList'),
    path('je-document-type/list/api', JEDocumentTypeListAPI.as_view(), name='JEDocumentTypeListAPI'),
    path('je-document-type/detail/api/<str:pk>', JEDocumentTypeDetailAPI.as_view(), name='JEDocumentTypeDetailAPI'),
    path('je-posting-group/list', JEPostingGroupList.as_view(), name='JEPostingGroupList'),
    path('je-posting-group/list/api', JEPostingGroupListAPI.as_view(), name='JEPostingGroupListAPI'),
    path('je-group-assignment/list', JEGroupAssignmentList.as_view(), name='JEGroupAssignmentList'),
    path('je-group-assignment/list/api', JEGroupAssignmentListAPI.as_view(), name='JEGroupAssignmentListAPI'),
    path('je-gl-account-mapping/list', JEGLAccountMappingList.as_view(), name='JEGLAccountMappingList'),
    path('je-gl-account-mapping/list/api', JEGLAccountMappingListAPI.as_view(), name='JEGLAccountMappingListAPI'),
    path('je-posting-rule/list', JEPostingRuleList.as_view(), name='JEPostingRuleList'),
    path('je-posting-rule/list/api', JEPostingRuleListAPI.as_view(), name='JEPostingRuleListAPI'),
    path('auto-je-configure-guide/list/api', JEConfigureGuidePage.as_view(), name='JEConfigureGuidePage'),
] + [
    # initial balance
    path('initial-balance/list', InitialBalanceList.as_view(), name='InitialBalanceList'),
    path('initial-balance/list/api', InitialBalanceListAPI.as_view(), name='InitialBalanceListAPI'),
    path('initial-balance/detail/<str:pk>', InitialBalanceDetail.as_view(), name='InitialBalanceDetail'),
    path('initial-balance/update/<str:pk>', InitialBalanceUpdate.as_view(), name='InitialBalanceUpdate'),
    path('initial-balance/detail/api/<str:pk>', InitialBalanceDetailAPI.as_view(), name='InitialBalanceDetailAPI'),
] + [
    path('asset-category/list', AssetCategoryList.as_view(), name='AssetCategoryList'),
    path('asset-category/list/api', AssetCategoryListAPI.as_view(), name='AssetCategoryListAPI'),
    path('asset-category/detail/api/<str:pk>', AssetCategoryDetailAPI.as_view(), name='AssetCategoryDetailAPI'),
]

# dimension
urlpatterns += [
    # view url
    path('dimension-definition/list', DimensionDefinitionList.as_view(), name='DimensionDefinitionList'),
    path('dimension-value/list', DimensionValueList.as_view(), name='DimensionValueList'),
    path('dimension-sync-config/list', DimensionSyncConfigList.as_view(), name='DimensionSyncConfigList'),
    path('dimension-account/list', DimensionAccountList.as_view(), name='DimensionAccountList'),
    path('dimension-split-template/list', DimensionSplitTemplateList.as_view(), name='DimensionSplitTemplateList'),

    # api url
    path('dimension-definition/list/api', DimensionDefinitionListAPI.as_view(), name='DimensionDefinitionListAPI'),
    path('dimension-definition/detail/api/<str:pk>', DimensionDefinitionDetailAPI.as_view(), name='DimensionDefinitionDetailAPI'),
    path('dimension-definition-values/api/<str:pk>', DimensionDefinitionWithValueAPI.as_view(), name='DimensionDefinitionWithValueAPI'),
    path('dimension-value/list/api', DimensionValueListAPI.as_view(), name='DimensionValueListAPI'),
    path('dimension-value/detail/api/<str:pk>', DimensionValueDetailAPI.as_view(), name='DimensionValueDetailAPI'),
    path('dimension-sync-config/application-list/api', DimensionSyncConfigApplicationListAPI.as_view(), name='DimensionSyncConfigApplicationListAPI'),
    path('dimension-sync-config/list/api', DimensionSyncConfigListAPI.as_view(), name='DimensionSyncConfigListAPI'),
    path('dimension-sync-config/detail/api/<str:pk>', DimensionSyncConfigDetailAPI.as_view(), name='DimensionSyncConfigDetailAPI'),
    path('dimension-list-for-accounting-account/detail/api/<str:pk>', DimensionListForAccountingAccountAPI.as_view(), name='DimensionListForAccountingAccountAPI'),
    path('dimension-account/list/api', DimensionAccountListAPI.as_view(), name='DimensionAccountListAPI'),
    path('dimension-account/detail/api/<str:pk>', DimensionAccountDetailAPI.as_view(), name='DimensionAccountDetailAPI'),
    path('dimension-split-template/list/api', DimensionSplitTemplateListAPI.as_view(), name='DimensionSplitTemplateListAPI'),
    path('dimension-split-template/detail/api/<str:pk>', DimensionSplitTemplateDetailAPI.as_view(), name='DimensionSplitTemplateDetailAPI'),
]
