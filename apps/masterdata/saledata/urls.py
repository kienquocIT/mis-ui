from django.urls import path

from apps.masterdata.saledata.views.accounting_policies import AccountingPoliciesList, AccountingPoliciesListAPI
from apps.masterdata.saledata.views.accounts import (
    ContactMasterDataList, SalutationCreateAPI, InterestCreateAPI,
    SalutationListAPI, InterestListAPI, AccountMasterDataList,
    IndustryListAPI, AccountTypeCreateAPI, IndustryCreateAPI, AccountTypeListAPI, ContactList,
    ContactListAPI, ContactListNotMapAccountAPI, ContactCreate, ContactCreateAPI,
    ContactUpdateAPI, ContactDetailAPI, AccountList, AccountListAPI, AccountDetailAPI, AccountUpdate,
    AccountCreate, AccountCreateAPI, AccountsMapEmployeeAPI, ContactUpdate, AccountTypeDetailAPI,
    IndustryDetailAPI, SalutationDetailAPI, InterestDetailAPI, ContactDetail,
    AccountDetail, AccountGroupListAPI, AccountGroupCreateAPI, AccountGroupDetailAPI, AccountForSaleListAPI,
    CustomerListAPI, SupplierListAPI, AccountDDListAPI
)
from apps.masterdata.saledata.views.attribute import AttributeListAPI, AttributeList, AttributeDetailAPI, \
    ProductAttributeListAPI
from apps.masterdata.saledata.views.balance_init import (
    BalanceInitList, BalanceInitListAPI, ImportBalanceInitDBAPIViews
)
from apps.masterdata.saledata.views.bank import BankMasterDataListAPI, BankMasterDataDetailAPI, \
    BankAccountMasterDataListAPI, BankAccountMasterDataDetailAPI, BankMasterDataList
from apps.masterdata.saledata.views.budget_plan_config import BudgetPlanConfigList, BudgetPlanConfigListAPI, \
    ListCanViewCompanyBudgetPlanAPI, ListCanLockBudgetPlanAPI
from apps.masterdata.saledata.views.category import CategoryMasterDataList, \
    FixedAssetClassificationGroupMasterDataListAPI, FixedAssetClassificationMasterDataListAPI, \
    ToolClassificationMasterDataListAPI, ToolClassificationMasterDateDetailAPI
from apps.masterdata.saledata.views.config import PaymentsTermsListAPI, PaymentsTermsDetailAPI
from apps.masterdata.saledata.views.document import DocumentTypeMasterDataListAPI, DocumentTypeMasterDataList, \
    DocumentTypeMasterDataDetailAPI
from apps.masterdata.saledata.views.expense import ExpenseList, ExpenseListAPI, ExpenseCreate, ExpenseDetail, \
    ExpenseDetailAPI, ExpenseForSaleListAPI, ExpenseUpdate
from apps.masterdata.saledata.views.expense_item import ExpenseItemList, ExpenseItemListAPI, ExpenseItemDetailAPI
from apps.masterdata.saledata.views.good_receipt import GoodReceiptList, GoodReceiptCreate, GoodReceiptListAPI, \
    GoodReceiptDetailAPI, GoodReceiptDetail, GoodReceiptEdit
from apps.masterdata.saledata.views.import_data import SaleDataImportDataList
from apps.masterdata.saledata.views.periods import PeriodsConfigList, PeriodsConfigListAPI, PeriodsConfigDetailAPI
from apps.masterdata.saledata.views.product import (
    ProductMasterDataList, ProductTypeListAPI, ProductCategoryListAPI, UnitOfMeasureListAPI,
    UnitOfMeasureGroupListAPI, UnitOfMeasureDetailAPI, ProductTypeDetailAPI, ProductCategoryDetailAPI,
    UnitOfMeasureGroupDetailAPI, ProductList, ProductCreate, ProductListAPI, ProductDetailAPI, ProductDetail,
    ProductForSaleListAPI, ProductUpdate, UnitOfMeasureOfGroupLaborListAPI, ProductForSaleDetailAPI,
    ProductQuickCreateAPI, ProductQuotationListLoadDBAPI, BaseUnitListAPI, ManufacturerListAPI, ManufacturerDetailAPI,
    ProductUploadAvatarAPI, ProductSpecificIdentificationSerialNumberListAPI
)
from apps.masterdata.saledata.views.price import (
    PriceMasterDataList, TaxCategoryListAPI, TaxListAPI, TaxDetailAPI, TaxCategoryDetailAPI, CurrencyListAPI,
    CurrencyDetailAPI, SyncSellingRateWithVCB, PriceList, PriceListAPI, PriceListDetail, PriceDetailAPI,
    UpdateProductForPriceListAPI, PriceListDeleteProductAPI, ProductAddFromPriceListAPI, DeleteCurrencyFromPriceListAPI,
    PriceDeleteAPI, PriceListUpdate, PriceListItemListImportDBAPI
)
from apps.masterdata.saledata.views.revenue_plan_config import RevenuePlanConfigList, RevenuePlanConfigListAPI
from apps.masterdata.saledata.views.shipment import (
    ShipmentMasterDataList, ContainerMasterDataListAPI,
    ContainerMasterDataDetailAPI, PackageMasterDataListAPI, PackageMasterDataDetailAPI
)
from apps.masterdata.saledata.views.shipping import (
    ShippingList, ShippingCreate, ShippingListAPI, ShippingDetail, ShippingDetailAPI, ShippingCheckListAPI,
    ShippingUpdate
)
from apps.masterdata.saledata.views.warehouse import (
    WareHouseList, WareHouseListAPI, WareHouseDetailAPI, WarehouseProductAPI, WareHouseListForInventoryAdjustmentAPI,
    WareHouseCreate, WareHouseDetail, WareHouseUpdate, WarehouseGetProductsListAPI, WarehouseLotListAPI,
    WarehouseSerialListAPI, ProductWarehouseAssetList, WarehouseGetProductsListAPIForGoodsTransfer,
    WareHouseForInventoryListAPI,
)
from apps.masterdata.saledata.views.meetingschedule import MeetingScheduleMasterdataList, MeetingRoomListAPI, \
    MeetingRoomDetailAPI
from apps.masterdata.saledata.views.invoice_sign import InvoiceSignList, InvoiceSignListAPI
from apps.masterdata.saledata.views.warehouse_config import (
    WarehouseConfigList, WarehouseConfigListAPI, InventoryInteractConfigDetailAPI
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
    path('masterdata/customer-list/api', CustomerListAPI.as_view(), name='CustomerListAPI'),
    path('masterdata/supplier-list/api', SupplierListAPI.as_view(), name='SupplierListAPI'),
    path('masterdata/industry/list/api', IndustryListAPI.as_view(), name='IndustryListAPI'),
    path('masterdata/industry/create/api', IndustryCreateAPI.as_view(), name='IndustryCreateAPI'),
    path('masterdata/industry/api/<str:pk>', IndustryDetailAPI.as_view(), name='IndustryDetailAPI'),
    path('masterdata/account-type/list/api', AccountTypeListAPI.as_view(), name='AccountTypeListAPI'),
    path(
        'masterdata/account-type/create/api', AccountTypeCreateAPI.as_view(), name='AccountTypeCreateAPI'
    ),
    path(
        'masterdata/account-type/api/<str:pk>', AccountTypeDetailAPI.as_view(),
        name='AccountTypeDetailAPI'
    ),
    path('masterdata/account-group/list/api', AccountGroupListAPI.as_view(), name='AccountGroupListAPI'),
    path(
        'masterdata/account-group/create/api', AccountGroupCreateAPI.as_view(),
        name='AccountGroupCreateAPI'
    ),
    path(
        'masterdata/account-group/api/<str:pk>', AccountGroupDetailAPI.as_view(),
        name='AccountGroupDetailAPI'
    ),
    path(
        'masterdata/meetingschedule', MeetingScheduleMasterdataList.as_view(),
        name='MeetingScheduleMasterdataList'
    ),
    path(
        'masterdata/meetingroom/api', MeetingRoomListAPI.as_view(),
        name='MeetingRoomListAPI'
    ),
    path(
        'masterdata/meetingroom/api/<str:pk>', MeetingRoomDetailAPI.as_view(),
        name='MeetingRoomDetailAPI'
    ),
    path(
        'masterdata/periodsconfig', PeriodsConfigList.as_view(),
        name='PeriodsConfigList'
    ),
    path(
        'masterdata/periodsconfig/api', PeriodsConfigListAPI.as_view(),
        name='PeriodsConfigListAPI'
    ),
    path(
        'masterdata/periodsconfig/api/<str:pk>', PeriodsConfigDetailAPI.as_view(),
        name='PeriodsConfigDetailAPI'
    ),
    path(
          'masterdata/accounting_policies', AccountingPoliciesList.as_view(),
          name='AccountingPoliciesList'
      ),
    path(
          'masterdata/accounting_policies/api', AccountingPoliciesListAPI.as_view(),
          name='AccountingPoliciesListAPI'
      ),
] + [
    path('contacts', ContactList.as_view(), name='ContactList'),
    path('contacts/api', ContactListAPI.as_view(), name='ContactListAPI'),
    path(
        'listnotmapaccount/api', ContactListNotMapAccountAPI.as_view(), name='ContactListNotMapAccountAPI'
    ),
    path('contact/create', ContactCreate.as_view(), name='ContactCreate'),
    path('contact/create/api', ContactCreateAPI.as_view(), name='ContactCreateAPI'),
    path('contact/update/<str:pk>', ContactUpdate.as_view(), name='ContactUpdate'),
    path('contact/update/api/<str:pk>', ContactUpdateAPI.as_view(), name='ContactUpdateAPI'),
    path('contact/<str:pk>', ContactDetail.as_view(), name='ContactDetail'),
    path('contact/api/<str:pk>', ContactDetailAPI.as_view(), name='ContactDetailAPI'),

] + [
    path('partners', AccountList.as_view(), name='AccountList'),
    path('partners/api', AccountListAPI.as_view(), name='AccountListAPI'),
    path('partner/create', AccountCreate.as_view(), name='AccountCreate'),
    path('partner/create/api', AccountCreateAPI.as_view(), name='AccountCreateAPI'),
    path('partner/api/<str:pk>', AccountDetailAPI.as_view(), name='AccountDetailAPI'),
    path('partner/detail/<str:pk>', AccountDetail.as_view(), name='AccountDetail'),
    path('partner/update/<str:pk>', AccountUpdate.as_view(), name='AccountUpdate'),

    path('partners-map-employees/api', AccountsMapEmployeeAPI.as_view(), name='AccountsMapEmployeeAPI'),
    path('partners-sale/api', AccountForSaleListAPI.as_view(), name='AccountForSaleListAPI'),
    path('partners-dropdown/api', AccountDDListAPI.as_view(), name='AccountDDListAPI'),
] + [
    path('masterdata/import', SaleDataImportDataList.as_view(), name='SaleDataImportDataList'),
    path('masterdata/product', ProductMasterDataList.as_view(), name='ProductMasterDataList'),
    path('masterdata/product-type/list/api', ProductTypeListAPI.as_view(), name='ProductTypeListAPI'),
    path(
        'masterdata/product-type/api/<str:pk>', ProductTypeDetailAPI.as_view(),
        name='ProductTypeDetailAPI'
    ),
    path(
        'masterdata/product-category/list/api', ProductCategoryListAPI.as_view(),
        name='ProductCategoryListAPI'
    ),
    path(
        'masterdata/product-category/api/<str:pk>', ProductCategoryDetailAPI.as_view(),
        name='ProductCategoryDetailAPI'
    ),
    path(
        'masterdata/manufacturer/list/api', ManufacturerListAPI.as_view(),
        name='ManufacturerListAPI'
    ),
    path(
        'masterdata/manufacturer/api/<str:pk>', ManufacturerDetailAPI.as_view(),
        name='ManufacturerDetailAPI'
    ),
    path('base-unit/api', BaseUnitListAPI.as_view(), name='BaseUnitListAPI'),
    path(
        'masterdata/unit-of-measure/list/api', UnitOfMeasureListAPI.as_view(), name='UnitOfMeasureListAPI'
    ),
    path(
        'masterdata/unit-of-measure-group/list/api', UnitOfMeasureGroupListAPI.as_view(),
        name='UnitOfMeasureGroupListAPI'
    ),
    path(
        'masterdata/unit-of-measure-group/api/<str:pk>', UnitOfMeasureGroupDetailAPI.as_view(),
        name='UnitOfMeasureGroupDetailAPI'
    ),
    path(
        'masterdata/unit-of-measure/api/<str:pk>', UnitOfMeasureDetailAPI.as_view(),
        name='UnitOfMeasureDetailAPI'
    ),
    path(
        'masterdata/uom-group-labor/list/api',
        UnitOfMeasureOfGroupLaborListAPI.as_view(),
        name='UnitOfMeasureOfGroupLaborListAPI'
    )
] + [
    path('products', ProductList.as_view(), name='ProductList'),
    path('product/quick-create', ProductQuickCreateAPI.as_view(), name='ProductQuickCreateAPI'),
    path('product/create', ProductCreate.as_view(), name='ProductCreate'),
    path('products/api', ProductListAPI.as_view(), name='ProductListAPI'),
    path('product/update/<str:pk>', ProductUpdate.as_view(), name='ProductUpdate'),
    path('product/detail/<str:pk>', ProductDetail.as_view(), name='ProductDetail'),
    path('product/api/<str:pk>', ProductDetailAPI.as_view(), name='ProductDetailAPI'),
    path(
        'product/api/<str:pk>/upload-avatar', ProductUploadAvatarAPI.as_view(), name='ProductUploadAvatarAPI'
    ),
    path(
        'product-si-serial-number-list/api',
        ProductSpecificIdentificationSerialNumberListAPI.as_view(),
        name='ProductSpecificIdentificationSerialNumberListAPI'
    ),
    path('products-sale/api/list', ProductForSaleListAPI.as_view(), name='ProductForSaleListAPI'),
    path('products-sale/detail-api/<str:pk>', ProductForSaleDetailAPI.as_view(), name='ProductForSaleDetailAPI'),
    ] + [
    path('masterdata/price', PriceMasterDataList.as_view(), name='PriceMasterDataList'),
    path('masterdata/tax-category/api', TaxCategoryListAPI.as_view(), name='TaxCategoryListAPI'),
    path('masterdata/tax/api', TaxListAPI.as_view(), name='TaxListAPI'),
    path('masterdata/tax/api/<str:pk>', TaxDetailAPI.as_view(), name='TaxDetailAPI'),
    path(
        'masterdata/tax-category/api/<str:pk>', TaxCategoryDetailAPI.as_view(),
        name='TaxCategoryDetailAPI'
    ),
    path('masterdata/currency/api/', CurrencyListAPI.as_view(), name='CurrencyListAPI'),
    path('masterdata/currency/api/<str:pk>', CurrencyDetailAPI.as_view(), name='CurrencyDetailAPI'),
    path(
        'masterdata/sync-selling-rate-from-VCB/api/<str:pk>',
        SyncSellingRateWithVCB.as_view(),
        name='SyncSellingRateWithVCB'
    ),
    path(
        'masterdata/payments-terms/api', PaymentsTermsListAPI.as_view(), name='PaymentsTermsListAPI'
    ),
    path(
        'masterdata/payments-terms/detail/api/<str:pk>',
        PaymentsTermsDetailAPI.as_view(),
        name='PaymentsTermsDetailAPI'
    ),
] + [
    path('price-list', PriceList.as_view(), name='PriceList'),
    path('price-list/api', PriceListAPI.as_view(), name='PriceListAPI'),
    path('price-list/detail/<str:pk>', PriceListDetail.as_view(), name='PriceListDetail'),
    path('price-list/update/<str:pk>', PriceListUpdate.as_view(), name='PriceListUpdate'),
    path('price-list/api/<str:pk>', PriceDetailAPI.as_view(), name='PriceDetailAPI'),
    path('delete-price-list/api/<str:pk>', PriceDeleteAPI.as_view(), name='PriceDeleteAPI'),
    path(
        'products-for-price-list/api/<str:pk>',
        UpdateProductForPriceListAPI.as_view(),
        name='UpdateProductForPriceListAPI'
    ),
    path(
        'delete-products-for-price-list/api/<str:pk>',
        PriceListDeleteProductAPI.as_view(),
        name='PriceListDeleteProductAPI'
    ),
    path(
        'create-product-from-price-list/api/<str:pk>',
        ProductAddFromPriceListAPI.as_view(),
        name='ProductAddFromPriceListAPI'
    ),
    path(
        'price-list-item-import-db/api',
        PriceListItemListImportDBAPI.as_view(),
        name='PriceListItemListImportDBAPI'
    ),
    path(
        'product-quotation-load-db/api',
        ProductQuotationListLoadDBAPI.as_view(),
        name='ProductQuotationListLoadDBAPI'
    ),
    path(
        'delete-currency-from-price-list/api/<str:pk>',
        DeleteCurrencyFromPriceListAPI.as_view(),
        name='DeleteCurrencyFromPriceListAPI',
    )
] + [
    path('expenses', ExpenseList.as_view(), name='ExpenseList'),
    path('expenses/api', ExpenseListAPI.as_view(), name='ExpenseListAPI'),
    path('expenses/create', ExpenseCreate.as_view(), name='ExpenseCreate'),
    path('expense/detail/<str:pk>', ExpenseDetail.as_view(), name='ExpenseDetail'),
    path('expense/api/<str:pk>', ExpenseDetailAPI.as_view(), name='ExpenseDetailAPI'),
    path('expenses-sale/api', ExpenseForSaleListAPI.as_view(), name='ExpenseForSaleListAPI'),
    path('expense/update/<str:pk>', ExpenseUpdate.as_view(), name='ExpenseUpdate')
] + [
    path('shippings', ShippingList.as_view(), name='ShippingList'),
    path('shippings/create', ShippingCreate.as_view(), name='ShippingCreate'),
    path('shippings/api', ShippingListAPI.as_view(), name='ShippingListAPI'),
    path('shipping/detail/<str:pk>', ShippingDetail.as_view(), name='ShippingDetail'),
    path('shipping/api/<str:pk>', ShippingDetailAPI.as_view(), name='ShippingDetailAPI'),
    path('shippings-check-api', ShippingCheckListAPI.as_view(), name='ShippingCheckListAPI'),
    path('shipping/update/<str:pk>', ShippingUpdate.as_view(), name='ShippingUpdate'),
]

# WareHouse
urlpatterns += [
    path('warehouses', WareHouseList.as_view(), name='WareHouseList'),
    path('warehouse/create', WareHouseCreate.as_view(), name='WareHouseCreate'),
    path('warehouse/detail/<str:pk>', WareHouseDetail.as_view(), name='WareHouseDetail'),
    path('warehouse/update/<str:pk>', WareHouseUpdate.as_view(), name='WareHouseUpdate'),
    path('warehouses/api', WareHouseListAPI.as_view(), name='WareHouseListAPI'),
    path(
        'warehouses-for-inventory-adjustment/api',
        WareHouseListForInventoryAdjustmentAPI.as_view(),
        name='WareHouseListForInventoryAdjustmentAPI'
    ),
    path('warehouse/api/<str:pk>', WareHouseDetailAPI.as_view(), name='WareHouseDetailAPI'),
    path('warehouse/product/api', WarehouseProductAPI.as_view(), name='WarehouseProductAPI'),
    path('warehouse-get-products/api', WarehouseGetProductsListAPI.as_view(), name='WarehouseGetProductsListAPI'),
    path('warehouse-get-products-for-goods-transfer/api', WarehouseGetProductsListAPIForGoodsTransfer.as_view(), name='WarehouseGetProductsListAPIForGoodsTransfer'),
    path('warehouse-lots/api', WarehouseLotListAPI.as_view(), name='WarehouseLotListAPI'),
    path('warehouse-serials/api', WarehouseSerialListAPI.as_view(), name='WarehouseSerialListAPI'),
    path('warehouse/product-asset/list/api', ProductWarehouseAssetList.as_view(), name='ProductWarehouseAssetList'),
    path('warehouse-for-inventory/api', WareHouseForInventoryListAPI.as_view(), name='WareHouseForInventoryListAPI'),
]
# // WareHouse
# Good receipt
urlpatterns += [
    path('good-receipt', GoodReceiptList.as_view(), name='GoodReceiptList'),
    path('good-receipt/api', GoodReceiptListAPI.as_view(), name='GoodReceiptListAPI'),
    path('good-receipt/create', GoodReceiptCreate.as_view(), name='GoodReceiptCreate'),
    path('good-receipt/detail/<str:pk>', GoodReceiptDetail.as_view(), name='GoodReceiptDetail'),
    path('good-receipt/edit/<str:pk>', GoodReceiptEdit.as_view(), name='GoodReceiptEdit'),
    path('good-receipt/detail/api/<str:pk>', GoodReceiptDetailAPI.as_view(), name='GoodReceiptDetailAPI')
]
# // WareHouse

# Expense Item
urlpatterns += [
    path('expense-items', ExpenseItemList.as_view(), name='ExpenseItemList'),
    path('expense-items/api', ExpenseItemListAPI.as_view(), name='ExpenseItemListAPI'),
    path('expense-items/api/<str:pk>', ExpenseItemDetailAPI.as_view(), name='ExpenseItemDetailAPI'),
]

urlpatterns += [
    path(
        'revenue-plan-config', RevenuePlanConfigList.as_view(),
        name='RevenuePlanConfigList'
    ),
    path(
        'revenue-plan-config/api', RevenuePlanConfigListAPI.as_view(),
        name='RevenuePlanConfigListAPI'
    ),
]

urlpatterns += [
    path(
        'budget-plan-config', BudgetPlanConfigList.as_view(),
        name='BudgetPlanConfigList'
    ),
    path(
        'budget-plan-config/api', BudgetPlanConfigListAPI.as_view(),
        name='BudgetPlanConfigListAPI'
    ),
    path(
        'list-can-view-company-budget-plan/api', ListCanViewCompanyBudgetPlanAPI.as_view(),
        name='ListCanViewCompanyBudgetPlanAPI'
    ),
    path(
        'list-can-lock-budget-plan/api', ListCanLockBudgetPlanAPI.as_view(),
        name='ListCanLockBudgetPlanAPI'
    ),
]

urlpatterns += [
    path(
        'balance-init', BalanceInitList.as_view(),
        name='BalanceInitList'
    ),
    path(
        'balance-init/api', BalanceInitListAPI.as_view(),
        name='BalanceInitListAPI'
    )
]

urlpatterns += [
    path('invoice_sign', InvoiceSignList.as_view(), name='InvoiceSignList'),
    path('invoice_sign/api', InvoiceSignListAPI.as_view(), name='InvoiceSignListAPI'),
]

urlpatterns += [
    path('inventory-import-config', WarehouseConfigList.as_view(), name='WarehouseConfigList'),
    path('inventory-import-config/api', WarehouseConfigListAPI.as_view(), name='WarehouseConfigListAPI'),
    path('inventory-import-config/api/<str:pk>', InventoryInteractConfigDetailAPI.as_view(), name='InventoryInteractConfigDetailAPI'),
]

urlpatterns += [
    path(
        'masterdata/import-balance-data-init-db/api/<str:pk>', ImportBalanceInitDBAPIViews.as_view(),
        name='ImportBalanceInitDBAPIViews'
    ),
]

urlpatterns += [
    path('masterdata/document-type/list', DocumentTypeMasterDataList.as_view(), name='DocumentTypeMasterDataList'),
    path('masterdata/document-type/api', DocumentTypeMasterDataListAPI.as_view(), name='DocumentTypeMasterDataListAPI'),
    path('masterdata/document-type/api/<str:pk>', DocumentTypeMasterDataDetailAPI.as_view(), name='DocumentTypeMasterDataDetailAPI'),
]

urlpatterns += [
    #view
    path('masterdata/category/list', CategoryMasterDataList.as_view(), name='CategoryMasterDataList'),

    #api
    path('masterdata/fixed-asset/classification-group/api', FixedAssetClassificationGroupMasterDataListAPI.as_view(), name='FixedAssetClassificationGroupMasterDataListAPI'),
    path('masterdata/fixed-asset/classification/api', FixedAssetClassificationMasterDataListAPI.as_view(), name='FixedAssetClassificationMasterDataListAPI'),
    path('masterdata/tool/classification/api', ToolClassificationMasterDataListAPI.as_view(), name='ToolClassificationMasterDataListAPI'),
    path('masterdata/tool/classification/api/<str:pk>', ToolClassificationMasterDateDetailAPI.as_view(), name='ToolClassificationMasterDateDetailAPI'),
]

urlpatterns += [
    path('masterdata/bank/list', BankMasterDataList.as_view(), name='BankMasterDataList'),
    path('masterdata/bank/list/api', BankMasterDataListAPI.as_view(), name='BankMasterDataListAPI'),
    path('masterdata/bank/detail/api/<str:pk>', BankMasterDataDetailAPI.as_view(), name='BankMasterDataDetailAPI'),
    path('masterdata/bank-account/list', BankAccountMasterDataListAPI.as_view(), name='BankAccountMasterDataListAPI'),
    path('masterdata/bank-account/detail/api/<str:pk>', BankAccountMasterDataDetailAPI.as_view(), name='BankAccountMasterDataDetailAPI'),
]

urlpatterns += [
    path('attribute/list', AttributeList.as_view(), name='AttributeList'),
    path('attribute/list/api', AttributeListAPI.as_view(), name='AttributeListAPI'),
    path('attribute/detail/api/<str:pk>', AttributeDetailAPI.as_view(), name='AttributeDetailAPI'),
    path('product-attribute/detail/api/<str:pk>', ProductAttributeListAPI.as_view(), name='ProductAttributeListAPI'),
]

urlpatterns += [
    path('masterdata/shipment/list', ShipmentMasterDataList.as_view(), name='ShipmentMasterDataList'),
    path('masterdata/container/list/api', ContainerMasterDataListAPI.as_view(), name='ContainerMasterDataListAPI'),
    path('masterdata/container/detail/api/<str:pk>', ContainerMasterDataDetailAPI.as_view(), name='ContainerMasterDataDetailAPI'),
    path('masterdata/package/list/api', PackageMasterDataListAPI.as_view(), name='PackageMasterDataListAPI'),
    path('masterdata/package/detail/api/<str:pk>', PackageMasterDataDetailAPI.as_view(), name='PackageMasterDataDetailAPI'),
]
