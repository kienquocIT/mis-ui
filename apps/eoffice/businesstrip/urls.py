from django.urls import path

from apps.eoffice.businesstrip.views import BusinessTripRequestList, BusinessTripRequestListAPI, \
    BusinessTripRequestDetail, BusinessTripCreate, BusinessTripRequestCreateAPI, BusinessTripRequestEdit, \
    BusinessTripRequestEditAPI, BusinessTripRequestDetailAPI

urlpatterns = [
    path('request/list', BusinessTripRequestList.as_view(), name='BusinessTripRequestList'),
    path('request/list-api', BusinessTripRequestListAPI.as_view(), name='BusinessTripRequestListAPI'),
    path('request/create', BusinessTripCreate.as_view(), name='BusinessTripCreate'),
    path('request/create-api', BusinessTripRequestCreateAPI.as_view(), name='BusinessTripRequestCreateAPI'),
    path('request/detail/<str:pk>', BusinessTripRequestDetail.as_view(), name='BusinessTripRequestDetail'),
    path('request/detail-api/<str:pk>', BusinessTripRequestDetailAPI.as_view(), name='BusinessTripRequestDetailAPI'),
    path('request/update/<str:pk>', BusinessTripRequestEdit.as_view(), name='BusinessTripRequestEdit'),
    path('request/update-api/<str:pk>', BusinessTripRequestEditAPI.as_view(), name='BusinessTripRequestEditAPI'),
]
