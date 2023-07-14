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
    USER_RESET_PASSWORD = StringUrl('account/user/reset-password/{pk}')

    # attachment
    MEDIA_ACCESS_TOKEN = StringUrl('hr/employee/media-token')
    MEDIA_UPLOAD_FILE = StringUrl('f/files')
    API_FORWARD_ACCESS_TOKEN_MEDIA = StringUrl('auth/media/sign-in-valid')

    # Logging
    LOG_ACTIVITIES = StringUrl('log/activities')
    LOG_MY_NOTIFY_DATA_ALL = StringUrl('log/notifies/me')
    LOG_MY_NOTIFY_DETAIL = StringUrl('log/notify/{pk}')
    LOG_MY_NOTIFY_COUNT = StringUrl('log/notifies/me/count')
    LOG_MY_NOTIFY_SEEN_ALL = StringUrl('log/notifies/me/seen-all')
    LOG_MY_NOTIFY_CLEAN_ALL = StringUrl('log/notifies/me/clean-all')

    # bookmarks
    BOOKMARKS_LIST = StringUrl('log/bookmarks')
    BOOKMARKS_DETAIL = StringUrl('log/bookmark/{pk}')

    # pin doc
    PIN_DOC_LIST = StringUrl('log/pin-docs')
    PIN_DOC_DETAIL = StringUrl('log/pin-doc/{pk}')

    # state of task background
    TASK_BG = StringUrl('task-bg/{pk}')

    XXX = StringUrl('company/overview/{id}/{option}')

    # tenant
    TENANT_PLAN_LIST = StringUrl('tenant/tenant-plans')

    # account
    ACCOUNT_USER_COMPANY = StringUrl('account/user-company')
    ACCOUNT_USER_TENANT = StringUrl('account/user-tenant')

    # employee
    EMPLOYEE_UPLOAD_AVATAR = StringUrl('hr/employee/upload-avatar')
    EMPLOYEE_LIST = StringUrl('hr/employees')
    EMPLOYEE_DETAIL = StringUrl('hr/employee')
    EMPLOYEE_COMPANY = StringUrl('hr/employee/company')
    EMPLOYEE_COMPANY_NEW = StringUrl('hr/employee/company/{company_id}')
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
    INDICATOR_PARAM = StringUrl('base/indicator-params')

    APPLICATION_PROPERTY_OPPORTUNITY_LIST = StringUrl('base/applications-property-opportunity')

    TENANT = StringUrl('tenant/userlist')

    # HR

    # WORKFLOW
    WORKFLOW_OF_APPS = StringUrl('workflow/apps')
    WORKFLOW_OF_APP_DETAIL = StringUrl('workflow/app/{pk}')
    WORKFLOW = StringUrl('workflow')
    WORKFLOW_LIST = StringUrl('workflow/lists')
    WORKFLOW_CREATE = StringUrl('workflow/create')
    WORKFLOW_NODE_SYSTEM_LIST = StringUrl('workflow/nodes-system')

    # WORKFLOW RUNTIME
    RUNTIME_LIST = StringUrl('workflow/runtimes')
    RUNTIME_LIST_ME = StringUrl('workflow/runtimes/me')
    RUNTIME_DETAIL = StringUrl('workflow/runtime/{pk}')
    RUNTIME_DIAGRAM = StringUrl('workflow/diagram')
    RUNTIME_DIAGRAM_DETAIL = StringUrl('workflow/diagram/{pk}')
    RUNTIME_TASK_LIST = StringUrl('workflow/tasks')
    RUNTIME_TASK_DETAIL = StringUrl('workflow/task/{pk}')

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
    ACCOUNT_SALE_LIST = StringUrl('saledata/accounts-sale')

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
    PRODUCT_SALE_LIST = StringUrl('saledata/products-sale')

    # advance payment
    ADVANCE_PAYMENT_LIST = StringUrl('cashoutflow/advances-payments')
    ADVANCE_PAYMENT_DETAIL = StringUrl('cashoutflow/advances-payments')

    # payment
    PAYMENT_LIST = StringUrl('cashoutflow/payments')
    PAYMENT_DETAIL = StringUrl('cashoutflow/payments')

    PAYMENT_COST_ITEMS_LIST = StringUrl('cashoutflow/payment-cost-items-list')

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
    EXPENSE_SALE_LIST = StringUrl('saledata/expenses-sale')

    # opportunity
    OPPORTUNITY_LIST = StringUrl('opportunity/lists')
    OPPORTUNITY_EXPENSE_LIST = StringUrl('opportunity/opportunity-expense-list/lists')
    OPPORTUNITY_CALL_LOG_LIST = StringUrl('opportunity/call-log/lists')
    OPPORTUNITY_EMAIL_LIST = StringUrl('opportunity/send-email/lists')
    OPPORTUNITY_MEETING_LIST = StringUrl('opportunity/meeting/lists')

    # quotation
    QUOTATION_LIST = StringUrl('quotation/lists')
    QUOTATION_DETAIL = StringUrl('quotation')
    QUOTATION_EXPENSE_LIST = StringUrl('quotation/quotation-expense-list/lists')
    QUOTATION_CONFIG = StringUrl('quotation/config')
    QUOTATION_INDICATOR_LIST = StringUrl('quotation/indicators')
    QUOTATION_INDICATOR_DETAIL = StringUrl('quotation/indicator')
    QUOTATION_INDICATOR_RESTORE = StringUrl('quotation/indicator-restore')

    # address
    COUNTRIES = StringUrl('base/location/countries')
    CITIES = StringUrl('base/location/cities')
    DISTRICTS = StringUrl('base/location/districts?city_id=')
    WARDS = StringUrl('base/location/wards?district_id=')
    BASE_CURRENCY = StringUrl('base/currencies')

    # master-data/ promotion
    PROMOTION_LIST = StringUrl('promotion/list')
    PROMOTION_DETAIL = StringUrl('promotion/detail')
    PROMOTION_CHECK_LIST = StringUrl('promotion/check-list')

    # shipping
    SHIPPING_LIST = StringUrl('saledata/shippings')
    SHIPPING_DETAIL = StringUrl('saledata/shipping/{shipping_id}')
    SHIPPING_CHECK_LIST = StringUrl('saledata/shippings-check')

    # sale order
    SALE_ORDER_LIST = StringUrl('saleorder/lists')
    SALE_ORDER_DETAIL = StringUrl('saleorder')
    SALE_ORDER_EXPENSE_LIST = StringUrl('saleorder/saleorder-expense-list/lists')
    SALE_ORDER_CONFIG = StringUrl('saleorder/config')
    SALE_ORDER_INDICATOR_LIST = StringUrl('saleorder/indicators')
    SALE_ORDER_INDICATOR_DETAIL = StringUrl('saleorder/indicator')
    SALE_ORDER_INDICATOR_RESTORE = StringUrl('saleorder/indicator-restore')

    # warehouse
    WAREHOUSE_LIST = StringUrl('saledata/warehouses')
    WAREHOUSE_DETAIL = StringUrl('saledata/warehouse/{pk}')
    WAREHOUSE_PRODUCT_LIST = StringUrl('saledata/warehouses-products')
    WAREHOUSE_STOCK_PRODUCT = StringUrl('saledata/warehouses/check/{product_id}/{uom_id}')

    # shipping unit
    ITEM_UNIT_LIST = StringUrl('base/item-units')

    # good receipt
    GOOD_RECEIPT_API = StringUrl('saledata/good-receipt')
    GOOD_RECEIPT_PRODUCT_API = StringUrl('saledata/good-receipt/product')

    # return advance
    RETURN_ADVANCE_LIST = StringUrl('cashoutflow/return-advances')
    RETURN_ADVANCE_DETAIL = StringUrl('cashoutflow/return-advance/{pk}')

    # transition data config
    DELIVERY_CONFIG = StringUrl('delivery/config')
    DELIVERY_PICKING_LIST = StringUrl('delivery/picking')
    DELIVERY_PICKING_DETAIL = StringUrl('delivery/picking/{pk}')
    DELIVERY_PICKING_DETAIL_PRODUCTS = StringUrl('delivery/picking/{pk}/products')
    DELIVERY_SALEORDER_CALL = StringUrl('delivery/sale-order/{pk}')
    DELIVERY_LIST = StringUrl('delivery')
    DELIVERY_SUB_LIST = StringUrl('delivery/sub')
# Opportunity detail
    OPPORTUNITY_DETAIL = StringUrl('opportunity/{pk}')

    # Opportunity config
    OPPORTUNITY_CONFIG = StringUrl('opportunity/config')
    OPPORTUNITY_CUSTOMER_DECISION_FACTOR = StringUrl('opportunity/config/decision-factors')
    OPPORTUNITY_CUSTOMER_DECISION_FACTOR_DETAIL = StringUrl('opportunity/config/decision-factor/{pk}')
    OPPORTUNITY_CONFIG_STAGE = StringUrl('opportunity/config/stage')
    OPPORTUNITY_CONFIG_STAGE_DETAIL = StringUrl('opportunity/config/stage/{pk}')

    # restore Opportunity Stage
    RESTORE_DEFAULT_OPPORTUNITY_CONFIG_STAGE = StringUrl('company/default-opportunity-stage/{pk}')

    # Task
    OPPORTUNITY_TASK_CONFIG = StringUrl('task/config')
    OPPORTUNITY_TASK_STT_LIST = StringUrl('task/status')
    OPPORTUNITY_TASK_LIST = StringUrl('task/list')
    OPPORTUNITY_TASK_DETAIL = StringUrl('task/detail')
    OPPORTUNITY_TASK_LOG_WORK = StringUrl('task/log-work')
    OPPORTUNITY_TASK_STT_UPDATE = StringUrl('task/update-status')
