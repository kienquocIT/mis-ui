from django.urls import path

from apps.hrm.attandance.views import ShiftMasterDataList, ShiftMasterDataListAPI

urlpatterns = [
    path('shift/list', ShiftMasterDataList.as_view(), name='ShiftMasterDataList'),
    path('shift/list/api', ShiftMasterDataListAPI.as_view(), name='ShiftMasterDataListAPI'),
]
