from django.urls import path

from apps.sale.promotion.views import PromotionList, PromotionCreate, CustomerParamFieldAPI

urlpatterns = [
    path('list', PromotionList.as_view(), name='PromotionList'),
    path('create', PromotionCreate.as_view(), name='PromotionCreate'),
    path('customer-params-filter', CustomerParamFieldAPI.as_view(), name='CustomerParamFieldAPI'),

]
