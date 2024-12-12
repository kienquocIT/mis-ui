from django.urls import path

from apps.sales.consulting.views import ConsultingList, ConsultingCreate, ConsultingAccountListAPI, ConsultingListAPI, \
    ConsultingProductCategoryListAPI

urlpatterns = [
    # view urls
    path('list', ConsultingList.as_view(), name='ConsultingList'),
    path('create', ConsultingCreate.as_view(), name='ConsultingCreate'),


    # api urls
    path('api/list', ConsultingListAPI.as_view(), name='ConsultingListAPI'),
    path('api/account/list', ConsultingAccountListAPI.as_view(), name='ConsultingAccountListAPI'),
    path('api/product-category/list', ConsultingProductCategoryListAPI.as_view(), name='ConsultingProductCategoryListAPI'),
]
