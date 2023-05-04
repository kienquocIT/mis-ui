from django.urls import path
from apps.masterdata.saledata.views.accounts import (
    ContactMasterDataList, SalutationCreateAPI,InterestCreateAPI,
    SalutationListAPI, InterestListAPI, AccountMasterDataList,
    IndustryListAPI, AccountTypeCreateAPI, IndustryCreateAPI, AccountTypeListAPI, ContactList,
    ContactListAPI, ContactListNotMapAccountAPI, ContactCreate, ContactCreateAPI,
    ContactUpdateAPI, ContactDetailAPI, AccountList, AccountListAPI, AccountDetailAPI,
    AccountCreate, AccountCreateAPI, AccountsMapEmployeeAPI, ContactUpdate, AccountTypeDetailAPI,
    IndustryDetailAPI, SalutationDetailAPI, InterestDetailAPI, ContactDetail,
    AccountDetail
)
from apps.masterdata.saledata.views.config import PaymentsTermsListAPI, PaymentsTermsDetailAPI
from apps.masterdata.saledata.views.expense import ExpenseList, ExpenseListAPI, ExpenseCreate, ExpenseDetail, ExpenseDetailAPI
from apps.masterdata.saledata.views.product import (
    ProductMasterDataList, ProductTypeListAPI,
    ProductCategoryListAPI, ExpenseTypeListAPI, UnitOfMeasureListAPI, UnitOfMeasureGroupListAPI,
    UnitOfMeasureDetailAPI, ProductTypeDetailAPI, ExpenseTypeDetailAPI, ProductCategoryDetailAPI,
    UnitOfMeasureGroupDetailAPI, ProductList, ProductCreate, ProductListAPI, ProductDetailAPI, ProductDetail,
)
from apps.masterdata.saledata.views.price import (
    PriceMasterDataList, TaxCategoryListAPI, TaxListAPI, TaxDetailAPI, TaxCategoryDetailAPI, CurrencyListAPI,
    CurrencyDetailAPI, SyncSellingRateWithVCB, PriceList, PriceListAPI, PriceListDetail, PriceDetailAPI,
    UpdateProductForPriceListAPI, PriceListDeleteProductAPI, ProductAddFromPriceListAPI, DeleteCurrencyFromPriceListAPI,
    PriceDeleteAPI
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
    path('masterdata/product-type/api/<str:pk>', ProductTypeDetailAPI.as_view(), name='ProductTypeDetailAPI'),
    path('masterdata/product-category/list/api', ProductCategoryListAPI.as_view(), name='ProductCategoryListAPI'),
    path(
        'masterdata/product-category/api/<str:pk>', ProductCategoryDetailAPI.as_view(),
        name='ProductCategoryDetailAPI'
    ),
    path('masterdata/expense-type/list/api', ExpenseTypeListAPI.as_view(), name='ExpenseTypeListAPI'),
    path('masterdata/expense-type/api/<str:pk>', ExpenseTypeDetailAPI.as_view(), name='ExpenseTypeDetailAPI'),
    path('masterdata/unit-of-measure/list/api', UnitOfMeasureListAPI.as_view(), name='UnitOfMeasureListAPI'),
    path(
        'masterdata/unit-of-measure-group/list/api', UnitOfMeasureGroupListAPI.as_view(),
        name='UnitOfMeasureGroupListAPI'
    ),
    path(
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
] + [
    path('masterdata/price', PriceMasterDataList.as_view(), name='PriceMasterDataList'),
    path('masterdata/tax-category/api', TaxCategoryListAPI.as_view(), name='TaxCategoryListAPI'),
    path('masterdata/tax/api', TaxListAPI.as_view(), name='TaxListAPI'),
    path('masterdata/tax/api/<str:pk>', TaxDetailAPI.as_view(), name='TaxDetailAPI'),
    path('masterdata/tax-category/api/<str:pk>', TaxCategoryDetailAPI.as_view(), name='TaxCategoryDetailAPI'),
    path('masterdata/currency/api/', CurrencyListAPI.as_view(), name='CurrencyListAPI'),
    path('masterdata/currency/api/<str:pk>', CurrencyDetailAPI.as_view(), name='CurrencyDetailAPI'),
    path(
        'masterdata/sync-selling-rate-from-VCB/api/<str:pk>',
        SyncSellingRateWithVCB.as_view(),
        name='SyncSellingRateWithVCB'
    ),
    path(
        'masterdata/payments-terms/api', PaymentsTermsListAPI.as_view(), name='PaymentsTermsListAPI'),
    path(
        'masterdata/payments-terms/detail/api/<str:pk>',
        PaymentsTermsDetailAPI.as_view(),
        name='PaymentsTermsDetailAPI'
    ),
] + [
    path('price-list', PriceList.as_view(), name='PriceList'),
    path('price-list/api', PriceListAPI.as_view(), name='PriceListAPI'),
    path('price-list/<str:pk>', PriceListDetail.as_view(), name='PriceListDetail'),
    path('price-list/api/<str:pk>', PriceDetailAPI.as_view(), name='PriceDetailAPI'),
    path('delete-price-list/api/<str:pk>', PriceDeleteAPI.as_view(), name='PriceDeleteAPI'),
    path(
        'products-for-price-list/api/<str:pk>',
        UpdateProductForPriceListAPI.as_view(),
        name='UpdateProductForPriceListAPI'),
    path(
        'delete-products-for-price-list/api/<str:pk>',
        PriceListDeleteProductAPI.as_view(),
        name='PriceListDeleteProductAPI'),
    path(
        'create-product-from-price-list/api/<str:pk>',
        ProductAddFromPriceListAPI.as_view(),
        name='ProductAddFromPriceListAPI'),
    path(
        'delete-currency-from-price-list/api/<str:pk>',
        DeleteCurrencyFromPriceListAPI.as_view(),
        name='DeleteCurrencyFromPriceListAPI',
    )
] + [
    path('account/<str:pk>', AccountDetail.as_view(), name='AccountDetail'),
] + [
    path('expenses', ExpenseList.as_view(), name='ExpenseList'),
    path('expenses/api', ExpenseListAPI.as_view(), name='ExpenseListAPI'),
    path('expenses/create', ExpenseCreate.as_view(), name='ExpenseCreate'),
    path('expense/<str:pk>', ExpenseDetail.as_view(), name='ExpenseDetail'),
    path('expense/api/<str:pk>', ExpenseDetailAPI.as_view(), name='ExpenseDetailAPI'),
]
