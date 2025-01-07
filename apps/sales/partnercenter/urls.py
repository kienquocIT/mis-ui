from django.urls import path

from apps.sales.partnercenter.views import ListCreate, ListList, ListDataObjectListAPI, ListListAPI, ListDetailAPI, \
    ResultList, ListResultListAPI, ListDetail, ListEmployeeListAPI, ListContactListAPI, ListUpdate, ListIndustryListAPI, \
    ListOpportunityConfigStageListAPI

list_urlpatterns = [
    path('list/list', ListList.as_view(), name='ListList'),
    path('list/create', ListCreate.as_view(), name='ListCreate'),
    path('list/result-list/<str:pk>', ResultList.as_view(), name='ResultList'),
    path('list/detail/<str:pk>', ListDetail.as_view(), name='ListDetail'),
    path('list/update/<str:pk>', ListUpdate.as_view(), name='ListUpdate'),

    path('api/data-obj-list', ListDataObjectListAPI.as_view(), name='ListDataObjectListAPI'),
    path('api/list/list', ListListAPI.as_view(), name='ListListAPI'),
    path('api/list/detail/<str:pk>', ListDetailAPI.as_view(), name='ListDetailAPI'),
    path('api/list/result-list/<str:pk>', ListResultListAPI.as_view(), name='ListResultListAPI'),
    path('api/list/employee-list', ListEmployeeListAPI.as_view(), name='ListEmployeeListAPI'),
    path('api/list/contact-list', ListContactListAPI.as_view(), name='ListContactListAPI'),
    path('api/list/industry-list', ListIndustryListAPI.as_view(), name='ListIndustryListAPI'),
    path('api/list/opp-config-stage-list', ListOpportunityConfigStageListAPI.as_view(), name='ListOpportunityConfigStageListAPI'),
]

urlpatterns = list_urlpatterns