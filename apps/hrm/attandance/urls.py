from django.urls import path

from apps.hrm.attandance.views import ShiftMasterDataList, ShiftMasterDataListAPI, ShiftMasterDataDetailAPI

urlpatterns = [
    path('shift/list', ShiftMasterDataList.as_view(), name='ShiftMasterDataList'),
    path('shift/list/api', ShiftMasterDataListAPI.as_view(), name='ShiftMasterDataListAPI'),
    path('shift/list/api/<str:pk>', ShiftMasterDataDetailAPI.as_view(), name='ShiftMasterDataDetailAPI'),
]
