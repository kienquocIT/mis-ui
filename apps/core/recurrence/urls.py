from django.urls import path

from apps.core.recurrence.views import RecurrenceCreate, RecurrenceListAPI, RecurrenceList, RecurrenceDetail, \
    RecurrenceDetailAPI, RecurrenceUpdate, TransactionTemplateList, RecurrenceActionList, RecurrenceActionListAPI, \
    RecurrenceActionDetailAPI

urlpatterns = [
    path('lists', RecurrenceList.as_view(), name='RecurrenceList'),
    path('api/lists', RecurrenceListAPI.as_view(), name='RecurrenceListAPI'),
    path('create', RecurrenceCreate.as_view(), name='RecurrenceCreate'),
    path('detail/<str:pk>', RecurrenceDetail.as_view(), name='RecurrenceDetail'),
    path('detail-api/<str:pk>', RecurrenceDetailAPI.as_view(), name='RecurrenceDetailAPI'),
    path('update/<str:pk>', RecurrenceUpdate.as_view(), name='RecurrenceUpdate'),
    path('transaction-template/lists', TransactionTemplateList.as_view(), name='TransactionTemplateList'),
    path('action/lists', RecurrenceActionList.as_view(), name='RecurrenceActionList'),
    path('action/api/lists', RecurrenceActionListAPI.as_view(), name='RecurrenceActionListAPI'),
    path('action/detail-api/<str:pk>', RecurrenceActionDetailAPI.as_view(), name='RecurrenceActionDetailAPI'),
]
