from django.urls import path

from .views import OvertimeList, OvertimeListAPI, OvertimeCreate, OvertimeDetail, OvertimeDetailAPI, OvertimeUpdate, \
    OvertimeUpdateAPI

urlpatterns = [
    # employee HRM page
    path('list', OvertimeList.as_view(), name='OvertimeList'),
    path('list/api', OvertimeListAPI.as_view(), name='OvertimeListAPI'),
    path('create', OvertimeCreate.as_view(), name='OvertimeCreate'),
    path('detail/<str:pk>', OvertimeDetail.as_view(), name='OvertimeDetail'),
    path('detail/<str:pk>/api', OvertimeDetailAPI.as_view(), name='OvertimeDetailAPI'),
    path('update/<str:pk>', OvertimeUpdate.as_view(), name='OvertimeUpdate'),
    path('update/<str:pk>/api', OvertimeUpdateAPI.as_view(), name='OvertimeUpdateAPI'),
]
