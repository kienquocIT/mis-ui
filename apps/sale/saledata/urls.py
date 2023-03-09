from django.urls import path
from apps.sale.saledata.views import ContactMasterDataList, SalutationCreateAPI,\
    InterestCreateAPI, SalutationListAPI, InterestListAPI, AccountMasterDataList, \
    IndustryListAPI, AccountTypeCreateAPI, IndustryCreateAPI, AccountTypeListAPI, ContactList,\
    ContactListAPI, ContactListNotMapAccountAPI, ContactCreate, ContactCreateAPI, \
    ContactUpdateAPI, ContactDetailAPI, AccountList, AccountListAPI, AccountDetailAPI, \
    AccountCreate, AccountCreateAPI, GetAccountNameAPI, ContactUpdate, AccountTypeDetailAPI, \
    IndustryDetailAPI, SalutationDetailAPI, InterestDetailAPI, ContactDetail


urlpatterns = [
    path('masterdata/contact', ContactMasterDataList.as_view(), name='ContactMasterDataList'),
    path('masterdata/salutation/create/api', SalutationCreateAPI.as_view(), name='SalutationCreateAPI'),
    path('masterdata/interests/create/api', InterestCreateAPI.as_view(), name='InterestCreateAPI'),
    path('masterdata/salutation/api', SalutationListAPI.as_view(), name='SalutationListAPI'),
    path('masterdata/interests/api', InterestListAPI.as_view(), name='InterestListAPI'),
    path('masterdata/salutation/api/<str:pk>', SalutationDetailAPI.as_view(), name='SalutationDetailAPI'),
    path('masterdata/interest/api/<str:pk>', InterestDetailAPI.as_view(), name='InterestDetailAPI'),

    path('masterdata/account', AccountMasterDataList.as_view(), name='AccountMasterDataList'),
    path('masterdata/industry/list/api', IndustryListAPI.as_view(), name='IndustryListAPI'),
    path('masterdata/industry/create/api', IndustryCreateAPI.as_view(), name='IndustryCreateAPI'),
    path('masterdata/industry/api/<str:pk>', IndustryDetailAPI.as_view(), name='IndustryDetailAPI'),
    path('masterdata/account-type/list/api', AccountTypeListAPI.as_view(), name='AccountTypeListAPI'),
    path('masterdata/account-type/create/api', AccountTypeCreateAPI.as_view(), name='AccountTypeCreateAPI'),
    path('masterdata/account-type/api/<str:pk>', AccountTypeDetailAPI.as_view(), name='AccountTypeDetailAPI'),
] + [
    path('contacts', ContactList.as_view(), name='ContactList'),
    path('contacts/api', ContactListAPI.as_view(), name='ContactListAPI'),
    path('listnotmapaccount/api', ContactListNotMapAccountAPI.as_view(), name='ContactListNotMapAccountAPI'),
    path('contact/create', ContactCreate.as_view(), name='ContactCreate'),
    path('contact/create/api', ContactCreateAPI.as_view(), name='ContactCreateAPI'),
    path('contact/update/<str:pk>', ContactUpdate.as_view(), name='ContactUpdate'),
    path('contact/update/api/<str:pk>', ContactUpdateAPI.as_view(), name='ContactUpdateAPI'),
    path('contact/<str:pk>', ContactDetail.as_view(), name='ContactDetail'),
    path('contact/api/<str:pk>', ContactDetailAPI.as_view(), name='ContactDetailAPI'),

] + [
    path('accounts', AccountList.as_view(), name='AccountList'),
    path('accounts/api', AccountListAPI.as_view(), name='AccountListAPI'),
    path('account/api/<str:pk>', AccountDetailAPI.as_view(), name='AccountDetailAPI'),

    path('account/create', AccountCreate.as_view(), name='AccountCreate'),
    path('account/create/api', AccountCreateAPI.as_view(), name='AccountCreateAPI'),

    path('getaccountname/api', GetAccountNameAPI.as_view(), name='GetAccountNameAPI'),
]
