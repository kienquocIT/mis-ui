from django.urls import path

from apps.core.recurrence.views import RecurrenceCreate, RecurrenceListAPI, RecurrenceList, RecurrenceDetail, \
    RecurrenceDetailAPI, RecurrenceUpdate

urlpatterns = [
    path('lists', RecurrenceList.as_view(), name='RecurrenceList'),
    path('api/lists', RecurrenceListAPI.as_view(), name='RecurrenceListAPI'),
    path('create', RecurrenceCreate.as_view(), name='RecurrenceCreate'),
    path('detail/<str:pk>', RecurrenceDetail.as_view(), name='RecurrenceDetail'),
    path('detail-api/<str:pk>', RecurrenceDetailAPI.as_view(), name='RecurrenceDetailAPI'),
    path('update/<str:pk>', RecurrenceUpdate.as_view(), name='RecurrenceUpdate'),
]
