from django.urls import path
from apps.sale.saledata.views import (
    ContactMasterDataList, SalutationCreateAPI,
    InterestCreateAPI, SalutationListAPI, InterestListAPI, AccountMasterDataList,
    IndustryListAPI, AccountTypeCreateAPI, IndustryCreateAPI, AccountTypeListAPI, ContactList,
    ContactListAPI, ContactListNotMapAccountAPI, ContactCreate, ContactCreateAPI,
    ContactUpdateAPI, ContactDetailAPI, AccountList, AccountListAPI, AccountDetailAPI,
    AccountCreate, AccountCreateAPI, AccountsMapEmployeeAPI, ContactUpdate, AccountTypeDetailAPI,
    IndustryDetailAPI, SalutationDetailAPI, InterestDetailAPI, ContactDetail, ProductMasterDataList, ProductTypeListAPI,
    ProductCategoryListAPI, ExpenseTypeListAPI, UnitOfMeasureListAPI, UnitOfMeasureGroupListAPI,
    UnitOfMeasureDetailAPI, ProductTypeDetailAPI, ExpenseTypeDetailAPI, ProductCategoryDetailAPI,
    UnitOfMeasureGroupDetailAPI, ProductList, ProductCreate, ProductListAPI, ProductDetailAPI, ProductDetail
)

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

    path('accounts-map-employees/api', AccountsMapEmployeeAPI.as_view(), name='AccountsMapEmployeeAPI'),
] + [
    path('masterdata/product', ProductMasterDataList.as_view(), name='ProductMasterDataList'),
    path('masterdata/product-type/list/api', ProductTypeListAPI.as_view(), name='ProductTypeListAPI'),
    path('masterdata/product-type/api<str:pk>', ProductTypeDetailAPI.as_view(), name='ProductTypeDetailAPI'),
    path('masterdata/product-category/list/api', ProductCategoryListAPI.as_view(), name='ProductCategoryListAPI'),
    path('masterdata/product-category/api/<str:pk>', ProductCategoryDetailAPI.as_view(),
        name='ProductCategoryDetailAPI'
    ),
    path('masterdata/expense-type/list/api', ExpenseTypeListAPI.as_view(), name='ExpenseTypeListAPI'),
    path('masterdata/expense-type/api/<str:pk>', ExpenseTypeDetailAPI.as_view(), name='ExpenseTypeDetailAPI'),
    path('masterdata/unit-of-measure/list/api', UnitOfMeasureListAPI.as_view(), name='UnitOfMeasureListAPI'),
    path(
        'masterdata/unit-of-measure-group/list/api', UnitOfMeasureGroupListAPI.as_view(),
        name='UnitOfMeasureGroupListAPI'
    ), path(
        'masterdata/unit-of-measure-group/api/<str:pk>', UnitOfMeasureGroupDetailAPI.as_view(),
        name='UnitOfMeasureGroupDetailAPI'
    ),
    path('masterdata/unit-of-measure/api/<str:pk>', UnitOfMeasureDetailAPI.as_view(), name='UnitOfMeasureDetailAPI')
] + [
    path('products', ProductList.as_view(), name='ProductList'),
    path('product/create', ProductCreate.as_view(), name='ProductCreate'),
    path('products/api', ProductListAPI.as_view(), name='ProductListAPI'),
    path('product/<str:pk>', ProductDetail.as_view(), name='ProductDetail'),
    path('product/api/<str:pk>', ProductDetailAPI.as_view(), name='ProductDetailAPI')
]
