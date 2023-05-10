from django.urls import path
from apps.sales.cashoutflow.views import (
    AdvanceList, AdvanceCreate
    # AdvanceListAPI, , AdvanceDetail, AdvanceDetailAPI
)

urlpatterns = [
    path('advances', AdvanceList.as_view(), name='AdvanceList'),
    # path('products/api', AdvanceListAPI.as_view(), name='AdvanceListAPI'),
    path('advance/create', AdvanceCreate.as_view(), name='AdvanceCreate'),
    # path('product/<str:pk>', AdvanceDetail.as_view(), name='AdvanceDetail'),
    # path('product/api/<str:pk>', AdvanceDetailAPI.as_view(), name='AdvanceDetailAPI')
]
