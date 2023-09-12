from django.urls import path

from apps.sales.inventory.views import GoodsReceiptList, GoodsReceiptCreate, GoodsReceiptListAPI, GoodsReceiptDetailAPI, \
    GoodsReceiptDetail, GoodsReceiptUpdate

urlpatterns = [
    # good receipt
    path('goods-receipt/list', GoodsReceiptList.as_view(), name='GoodsReceiptList'),
    path('goods-receipt/api/list', GoodsReceiptListAPI.as_view(), name='GoodsReceiptListAPI'),
    path('goods-receipt/create', GoodsReceiptCreate.as_view(), name='GoodsReceiptCreate'),
    path('goods-receipt/detail/<str:pk>', GoodsReceiptDetail.as_view(), name='GoodsReceiptDetail'),
    path('goods-receipt/detail-api/<str:pk>', GoodsReceiptDetailAPI.as_view(), name='GoodsReceiptDetailAPI'),
    path('goods-receipt/update/<str:pk>', GoodsReceiptUpdate.as_view(), name='GoodsReceiptUpdate'),
]
