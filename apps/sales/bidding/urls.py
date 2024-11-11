from django.urls import path

from apps.sales.bidding.views import BiddingCreate, BiddingList, BiddingListAPI, \
    DocumentMasterDataBiddingListAPI, AccountForBiddingListAPI, BiddingDetail, BiddingDetailAPI, BiddingUpdate, \
    BiddingResultAPI

urlpatterns = [
    # view urls
    path('list', BiddingList.as_view(), name='BiddingList'),
    path('create', BiddingCreate.as_view(), name='BiddingCreate'),
    path('detail/<str:pk>', BiddingDetail.as_view(), name='BiddingDetail'),
    path('update/<str:pk>', BiddingUpdate.as_view(), name='BiddingUpdate'),

    # api urls
    path('api/list', BiddingListAPI.as_view(), name='BiddingListAPI'),
    path('detail-api/<str:pk>', BiddingDetailAPI.as_view(), name='BiddingDetailAPI'),
    path('api/result', BiddingResultAPI.as_view(), name='BiddingResultAPI'),
    path('api/account-list', AccountForBiddingListAPI.as_view(), name='AccountForBiddingListAPI'),
    path('api/document-list', DocumentMasterDataBiddingListAPI.as_view(), name='DocumentMasterDataBiddingListAPI'),
]
