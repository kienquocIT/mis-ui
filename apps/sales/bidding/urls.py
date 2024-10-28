from django.urls import path

from apps.sales.bidding.views import BiddingCreate, BiddingList, BiddingListAPI, \
    DocumentMasterDataBiddingListAPI, AccountForBiddingListAPI

urlpatterns = [
    path('list', BiddingList.as_view(), name='BiddingList'),
    path('api/list', BiddingListAPI.as_view(), name='BiddingListAPI'),
    path('api/account-list', AccountForBiddingListAPI.as_view(), name='AccountForBiddingListAPI'),
    path('api/document-list', DocumentMasterDataBiddingListAPI.as_view(), name='DocumentMasterDataBiddingListAPI'),
    # path('api/lists', Bidding.as_view(), name='BiddingListAPI'),
    path('create', BiddingCreate.as_view(), name='BiddingCreate'),
]
