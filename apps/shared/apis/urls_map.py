"""not need import module"""


class StringUrl(str):  # pylint: disable=too-few-public-methods
    """convert str url"""

    def push_id(self, _id):
        """return url with id"""
        return f'{self}/{_id}'

    def fill_key(self, **kwargs):
        """return kwargs with format"""
        # 'abc/{a1}/{b1}/{c1}' + kwargs={"a1": "1", "b1": 2, "c1": 3}
        # Return ==> 'abc/1/2/3'
        return self.format(**kwargs)

    def fill_idx(self, *args):
        """return str with format"""
        # 'abc/{}/{}/{}' + args=[1, 2, 3]
        # Return ==> 'abc/1/2/3'
        return self.format(*args)


class ApiURL:  # pylint: disable=too-few-public-methods
    """API link BE"""

    @staticmethod
    def push_id(url, _id):
        """return str with url format"""
        return f'{url}/{_id}'

    login = StringUrl('auth/sign-in')
    logout = StringUrl('auth/logout')
    my_profile = StringUrl('auth/profile')
    ALIVE_CHECK = StringUrl('auth/alive-check')
    refresh_token = StringUrl('auth/token-refresh')
    SWITCH_COMPANY = StringUrl('auth/switch-company')
    tenants = StringUrl('provisioning/tenants')
    user_list = StringUrl('account/users')
    user_detail = StringUrl('account/user')

    # tenant
    TENANT_PLAN_LIST = StringUrl('tenant/tenant-plans')

    # account
    ACCOUNT_USER_COMPANY = StringUrl('account/user-company')
    ACCOUNT_USER_TENANT = StringUrl('account/user-tenant')

    # employee
    EMPLOYEE_LIST = StringUrl('hr/employees')
    EMPLOYEE_DETAIL = StringUrl('hr/employee')
    EMPLOYEE_COMPANY = StringUrl('hr/employee/company')
    EMPLOYEE_TENANT = StringUrl('hr/employee/tenant')

    # organization/group
    GROUP_LEVEL_LIST = StringUrl('hr/levels')
    GROUP_LIST = StringUrl('hr/groups')
    GROUP_DETAIL = StringUrl('hr/group')
    GROUP_PARENT = StringUrl('hr/group/parent')

    # home/company
    COMPANY_CONFIG = StringUrl('company/config')
    COMPANY_LIST = StringUrl('company/list')
    COMPANY_DETAIL = 'company/list'
    COMPANY_OVERVIEW = StringUrl('company/overview')
    COMPANY_USER_NOT_MAP_EMPLOYEE = StringUrl('company/user-available')
    COMPANY_USER_COMPANY = StringUrl('company/user-company')

    # organization/role
    ROLE_LIST = StringUrl('hr/roles')
    ROLE_DETAIL = StringUrl('hr/role')

    # base
    PLAN_LIST = StringUrl('base/plans')
    TENANT_APPLICATION_LIST = StringUrl('base/tenant-applications')
    APPLICATION_PROPERTY_LIST = StringUrl('base/tenant-applications-property')
    APPLICATION_PROPERTY_EMPLOYEE_LIST = StringUrl('base/applications-property-employee')
    APPLICATION_PERMISSION = StringUrl('base/permissions')

    TENANT = StringUrl('tenant/userlist')

    # HR

    # WORKFLOW
    WORKFLOW = StringUrl('workflow')
    WORKFLOW_LIST = StringUrl('workflow/lists')
    WORKFLOW_CREATE = StringUrl('workflow/create')
    WORKFLOW_NODE_SYSTEM_LIST = StringUrl('workflow/nodes-system')

    # crm/contact
    CONTACT_LIST = StringUrl('saledata/contacts')
    CONTACT_DETAIL = StringUrl('saledata/contact')
    CONTACT_LIST_NOT_MAP_ACCOUNT = StringUrl('saledata/contacts-not-map-account')

    # masterdata/lookup/contact
    SALUTATION_LIST = StringUrl('saledata/salutations')
    INTERESTS_LIST = StringUrl('saledata/interests')
    SALUTATION_DETAIL = StringUrl('saledata/salutation/')
    INTEREST_DETAIL = StringUrl('saledata/interest/')

    # masterdata/lookup/account
    INDUSTRY_LIST = StringUrl('saledata/industries')
    ACCOUNT_TYPE_LIST = StringUrl('saledata/accounttypes')
    ACCOUNT_TYPE_DETAIL = StringUrl('saledata/accounttype/')
    ACCOUNT_GROUP_LIST = StringUrl('saledata/accountgroups')
    ACCOUNT_GROUP_DETAIL = StringUrl('saledata/accountgroup/')
    INDUSTRY_DETAIL = StringUrl('saledata/industry/')

    # crm/account
    ACCOUNT_LIST = StringUrl('saledata/accounts')
    ACCOUNT_DETAIL = StringUrl('saledata/account/')
    ACCOUNTS_MAP_EMPLOYEES = StringUrl('saledata/accounts-map-employees')

    # masterdata/product
    PRODUCT_TYPE_LIST = StringUrl('saledata/product-types')
    PRODUCT_TYPE_DETAIL = StringUrl('saledata/product-type/')
    PRODUCT_CATEGORY_LIST = StringUrl('saledata/product-categories')
    PRODUCT_CATEGORY_DETAIL = StringUrl('saledata/product-category/')
    EXPENSE_TYPE_LIST = StringUrl('saledata/expense-types')
    EXPENSE_TYPE_DETAIL = StringUrl('saledata/expense-type/')
    UNIT_OF_MEASURE_GROUP = StringUrl('saledata/units-of-measure-group')
    UNIT_OF_MEASURE_GROUP_DETAIL = StringUrl('saledata/unit-of-measure-group/')
    UNIT_OF_MEASURE = StringUrl('saledata/units-of-measure')
    UNIT_OF_MEASURE_DETAIL = StringUrl('saledata/unit-of-measure/')

    # product
    PRODUCT_LIST = StringUrl('saledata/products')
    PRODUCT_DETAIL = StringUrl('saledata/product/')

    # advance payment
    ADVANCE_PAYMENT_LIST = StringUrl('cashoutflow/advances-payments')
    ADVANCE_PAYMENT_DETAIL = StringUrl('cashoutflow/advances-payments/')

    # masterdata/price
    TAX_CATEGORY_LIST = StringUrl('saledata/tax-categories')
    TAX_LIST = StringUrl('saledata/taxes')
    TAX_DETAIL = StringUrl('saledata/tax/')
    TAX_CATEGORY_DETAIL = StringUrl('saledata/tax-category/')
    CURRENCY_LIST = StringUrl('saledata/currencies')
    CURRENCY_DETAIL = StringUrl('saledata/currency/')
    SYNC_SELLING_RATE = StringUrl('saledata/sync-selling-rate-with-VCB/')

    # price
    PRICE_LIST = StringUrl('saledata/prices')
    PRICE_DETAIL = StringUrl('saledata/price/')
    PRICE_DELETE = StringUrl('saledata/delete-price/')
    PRODUCTS_FOR_PRICE_LIST = StringUrl('saledata/update-products-for-price-list/')
    PRICE_LIST_DELETE_PRODUCT = StringUrl('saledata/delete-products-for-price-list/')
    PRODUCT_ADD_FROM_PRICE_LIST = StringUrl('saledata/create-product-from-price-list/')
    DELETE_CURRENCY_FROM_PRICE_LIST = StringUrl('saledata/delete-currency-from-price-list/')

    # payment terms
    PAYMENT_TERMS = StringUrl('saledata/masterdata/config/payment-term')

    # expense
    EXPENSE_LIST = StringUrl('saledata/expenses')
    EXPENSE_DETAIL = StringUrl('saledata/expense/{expense_id}')

    # opportunity
    OPPORTUNITY_LIST = StringUrl('opportunity/lists')

    # quotation
    QUOTATION_LIST = StringUrl('quotation/lists')
    QUOTATION_DETAIL = StringUrl('quotation')
    QUOTATION_EXPENSE_LIST = StringUrl('quotation/quotation-expense-list/lists')

    # address
    COUNTRIES = StringUrl('base/location/countries')
    CITIES = StringUrl('base/location/cities')
    DISTRICTS = StringUrl('base/location/districts?city_id=')
    WARDS = StringUrl('base/location/wards?district_id=')
    BASE_CURRENCY = StringUrl('base/currencies')

    # master-data/ promotion
    PROMOTION_LIST = StringUrl('promotion/list')
    PROMOTION_DETAIL = StringUrl('promotion/detail')

    # shipping
    SHIPPING_LIST = StringUrl('saledata/shippings')
    SHIPPING_DETAIL = StringUrl('saledata/shipping/{shipping_id}')

    # sale order
    SALE_ORDER_LIST = StringUrl('saleorder/lists')
    SALE_ORDER_DETAIL = StringUrl('saleorder')

    # warehouse
    WAREHOUSE_LIST = StringUrl('saledata/warehouses')
    WAREHOUSE_DETAIL = StringUrl('saledata/warehouse/{pk}')

# shipping unit
    ITEM_UNIT_LIST = StringUrl('base/item-units')
