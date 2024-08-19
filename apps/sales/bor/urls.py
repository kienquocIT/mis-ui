from django.urls import path
from apps.sales.bor.views import (
    BORList, BORCreate, BORDetail, BORUpdate, BORListAPI, BORDetailAPI,
)

urlpatterns = [
    path('list', BORList.as_view(), name='BORList'),
    path('create', BORCreate.as_view(), name='BORCreate'),
    path('detail/<str:pk>', BORDetail.as_view(), name='BORDetail'),
    path('update/<str:pk>', BORUpdate.as_view(), name='BORUpdate'),
    path('api', BORListAPI.as_view(), name='BORListAPI'),
    path('api/<str:pk>', BORDetailAPI.as_view(), name='BORDetailAPI')
]
