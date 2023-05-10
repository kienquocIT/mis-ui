from django.urls import path

from apps.masterdata.promotion.views import PromotionList, PromotionCreate, CustomerParamFieldAPI, \
    PromotionListAPI, PromotionCreateAPI, PromotionDetail, PromotionDetailAPI

urlpatterns = [
    path('list', PromotionList.as_view(), name='PromotionList'),
    path('create', PromotionCreate.as_view(), name='PromotionCreate'),
    path('create-api', PromotionCreateAPI.as_view(), name='PromotionCreateAPI'),
    path('detail/<str:pk>', PromotionDetail.as_view(), name='PromotionDetail'),
    path('detail-api/<str:pk>', PromotionDetailAPI.as_view(), name='PromotionDetailAPI'),
    path('customer-params-filter', CustomerParamFieldAPI.as_view(), name='CustomerParamFieldAPI'),
    path('list-api', PromotionListAPI.as_view(), name='PromotionListAPI'),

]
