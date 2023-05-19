from django.urls import path

from apps.masterdata.promotion.views import PromotionList, PromotionCreate, \
    PromotionListAPI, PromotionCreateAPI, PromotionDetail, PromotionDetailAPI, PromotionCheckListAPI

urlpatterns = [
    path('list', PromotionList.as_view(), name='PromotionList'),
    path('create', PromotionCreate.as_view(), name='PromotionCreate'),
    path('create-api', PromotionCreateAPI.as_view(), name='PromotionCreateAPI'),
    path('detail/<str:pk>', PromotionDetail.as_view(), name='PromotionDetail'),
    path('detail-api/<str:pk>', PromotionDetailAPI.as_view(), name='PromotionDetailAPI'),
    path('list-api', PromotionListAPI.as_view(), name='PromotionListAPI'),
    path('check-list-api', PromotionCheckListAPI.as_view(), name='PromotionCheckListAPI'),

]
