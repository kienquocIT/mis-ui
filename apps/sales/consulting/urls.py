from django.urls import path

from apps.sales.consulting.views import ConsultingList, ConsultingCreate, ConsultingAccountListAPI, ConsultingListAPI, \
    ConsultingProductCategoryListAPI, ConsultingDocumentMasterDataListAPI, ConsultingDetail, ConsultingDetailAPI, \
    ConsultingUpdate, ConsultingOppDetailAPI

urlpatterns = [
    # view urls
    path('list', ConsultingList.as_view(), name='ConsultingList'),
    path('create', ConsultingCreate.as_view(), name='ConsultingCreate'),
    path('detail/<str:pk>', ConsultingDetail.as_view(), name='ConsultingDetail'),
    path('update/<str:pk>', ConsultingUpdate.as_view(), name='ConsultingUpdate'),

    # api urls
    path('api/list', ConsultingListAPI.as_view(), name='ConsultingListAPI'),
    path('api/detail/<str:pk>', ConsultingDetailAPI.as_view(), name='ConsultingDetailAPI'),
    path('api/account/list', ConsultingAccountListAPI.as_view(), name='ConsultingAccountListAPI'),
    path('api/product-category/list', ConsultingProductCategoryListAPI.as_view(), name='ConsultingProductCategoryListAPI'),
    path('api/masterdata-doc/list', ConsultingDocumentMasterDataListAPI.as_view(), name='ConsultingDocumentMasterDataListAPI'),
    path('api/opp-detail/<str:pk>', ConsultingOppDetailAPI.as_view(), name='ConsultingOppDetailAPI'),
]
