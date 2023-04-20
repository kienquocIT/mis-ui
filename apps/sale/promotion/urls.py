from django.urls import path

from apps.sale.promotion.views import PromotionList, PromotionCreate

urlpatterns = [
    path('list', PromotionList.as_view(), name='PromotionList'),
    path('create', PromotionCreate.as_view(), name='PromotionCreate'),
]
